import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Card, InputGroup } from 'react-bootstrap';

// 定義單位類型和單位轉換關係
interface UnitCategory {
  name: string;
  units: {
    [key: string]: number; // 相對於基準單位的轉換係數
  };
  baseUnit: string;
}

const UnitConverter: React.FC = () => {
  const { t } = useTranslation();
  
  // 定義各種單位類別和轉換
  const unitCategories: UnitCategory[] = [
    {
      name: t('tools.length'),
      baseUnit: 'meter',
      units: {
        'meter': 1,
        'kilometer': 1000,
        'centimeter': 0.01,
        'millimeter': 0.001,
        'inch': 0.0254,
        'foot': 0.3048,
        'yard': 0.9144,
        'mile': 1609.344
      }
    },
    {
      name: t('tools.weight'),
      baseUnit: 'gram',
      units: {
        'gram': 1,
        'kilogram': 1000,
        'milligram': 0.001,
        'pound': 453.59237,
        'ounce': 28.3495231,
        'ton': 1000000
      }
    },
    {
      name: t('tools.area'),
      baseUnit: 'squareMeter',
      units: {
        'squareMeter': 1,
        'squareKilometer': 1000000,
        'hectare': 10000,
        'squareFoot': 0.09290304,
        'squareYard': 0.83612736,
        'acre': 4046.8564224,
        'squareMile': 2589988.110336
      }
    },
    {
      name: t('tools.volume'),
      baseUnit: 'liter',
      units: {
        'liter': 1,
        'milliliter': 0.001,
        'cubicMeter': 1000,
        'gallon': 3.78541178,
        'fluidOunce': 0.0295735296,
        'cup': 0.2365882365
      }
    },
    {
      name: t('tools.temperature'),
      baseUnit: 'celsius',
      units: {
        'celsius': 1,
        'fahrenheit': 2,
        'kelvin': 3
      }
    },
    {
      name: t('tools.time'),
      baseUnit: 'second',
      units: {
        'second': 1,
        'minute': 60,
        'hour': 3600,
        'day': 86400,
        'week': 604800,
        'month': 2592000, // 30天
        'year': 31536000 // 365天
      }
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(unitCategories[0]);
  const [fromUnit, setFromUnit] = useState<string>(selectedCategory.baseUnit);
  const [toUnit, setToUnit] = useState<string>(Object.keys(selectedCategory.units)[1]);
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');

  // 處理溫度特殊轉換
  const convertTemperature = (value: number, from: string, to: string): number => {
    // 先轉成攝氏
    let celsius: number = 0;
    if (from === 'celsius') {
      celsius = value;
    } else if (from === 'fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'kelvin') {
      celsius = value - 273.15;
    }

    // 從攝氏轉到目標單位
    if (to === 'celsius') {
      return celsius;
    } else if (to === 'fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (to === 'kelvin') {
      return celsius + 273.15;
    }
    
    return 0;
  };

  // 進行單位轉換計算
  const convert = () => {
    if (!fromValue || isNaN(Number(fromValue))) {
      setToValue('');
      return;
    }

    const value = parseFloat(fromValue);
    
    if (selectedCategory.name === t('tools.temperature')) {
      const result = convertTemperature(value, fromUnit, toUnit);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      // 標準轉換公式: toValue = fromValue * (fromUnit比例 / toUnit比例)
      const result = value * (selectedCategory.units[fromUnit] / selectedCategory.units[toUnit]);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  // 當輸入值或單位變更時進行轉換
  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, selectedCategory]);

  // 當類別變更時重置單位
  useEffect(() => {
    const unitKeys = Object.keys(selectedCategory.units);
    setFromUnit(selectedCategory.baseUnit);
    setToUnit(unitKeys.find(unit => unit !== selectedCategory.baseUnit) || unitKeys[0]);
  }, [selectedCategory]);

  return (
    <Container className="my-4">
      <h1 className="mb-4">{t('tools.unitConverter')}</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('tools.selectCategory')}</Form.Label>
              <Form.Select 
                value={unitCategories.findIndex(cat => cat.name === selectedCategory.name)}
                onChange={(e) => setSelectedCategory(unitCategories[parseInt(e.target.value)])}
              >
                {unitCategories.map((category, index) => (
                  <option key={category.name} value={index}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('tools.from')}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                    />
                    <Form.Select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                    >
                      {Object.keys(selectedCategory.units).map(unit => (
                        <option key={`from-${unit}`} value={unit}>
                          {t(`tools.units.${unit}`)}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('tools.to')}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={toValue}
                      readOnly
                    />
                    <Form.Select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                    >
                      {Object.keys(selectedCategory.units).map(unit => (
                        <option key={`to-${unit}`} value={unit}>
                          {t(`tools.units.${unit}`)}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>{t('tools.aboutUnitConversion')}</Card.Title>
          <Card.Text>
            {t('tools.unitConverterDescription')}
          </Card.Text>
          
          <Card.Title>{t('tools.commonConversions')}</Card.Title>
          <ul>
            <li>1 {t('tools.units.foot')} = 0.3048 {t('tools.units.meter')}</li>
            <li>1 {t('tools.units.mile')} = 1.60934 {t('tools.units.kilometer')}</li>
            <li>1 {t('tools.units.pound')} = 0.45359 {t('tools.units.kilogram')}</li>
            <li>1 {t('tools.units.gallon')} = 3.78541 {t('tools.units.liter')}</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UnitConverter;