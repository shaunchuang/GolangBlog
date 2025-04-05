import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const Base64: React.FC = () => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    try {
      setError(null);
      if (mode === 'encode') {
        // 編碼
        const encoded = btoa(encodeURIComponent(inputText));
        setOutputText(encoded);
      } else {
        // 解碼
        const decoded = decodeURIComponent(atob(inputText));
        setOutputText(decoded);
      }
    } catch (e) {
      setError(t('tools.conversionError'));
      console.error('Conversion error:', e);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
      .then(() => {
        alert(t('tools.copiedToClipboard'));
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">{t('tools.base64')}</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('tools.conversionMode')}</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label={t('tools.encode')}
                  name="convertMode"
                  id="encode"
                  checked={mode === 'encode'}
                  onChange={() => setMode('encode')}
                />
                <Form.Check
                  inline
                  type="radio"
                  label={t('tools.decode')}
                  name="convertMode"
                  id="decode"
                  checked={mode === 'decode'}
                  onChange={() => setMode('decode')}
                />
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{mode === 'encode' ? t('tools.textToEncode') : t('tools.base64ToDecode')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={mode === 'encode' ? t('tools.enterTextToEncode') : t('tools.enterBase64ToDecode')}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{mode === 'encode' ? t('tools.encodedBase64') : t('tools.decodedText')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={outputText}
                    readOnly
                    placeholder={mode === 'encode' ? t('tools.encodedResult') : t('tools.decodedResult')}
                  />
                </Form.Group>
              </Col>
            </Row>

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            <div className="d-flex mt-3">
              <Button variant="primary" onClick={handleConvert} className="me-2">
                {mode === 'encode' ? t('tools.encode') : t('tools.decode')}
              </Button>
              
              <Button variant="secondary" onClick={handleCopyToClipboard} disabled={!outputText}>
                {t('tools.copyToClipboard')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          <Card.Title>{t('tools.whatIsBase64')}</Card.Title>
          <Card.Text>
            {t('tools.base64Description')}
          </Card.Text>
          
          <Card.Title>{t('tools.whenToUseBase64')}</Card.Title>
          <ul>
            <li>{t('tools.base64UseCase1')}</li>
            <li>{t('tools.base64UseCase2')}</li>
            <li>{t('tools.base64UseCase3')}</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Base64;