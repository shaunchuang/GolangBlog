import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const LoanCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(2.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [paymentType, setPaymentType] = useState<string>('annuity');
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const calculateLoan = () => {
    const principal = loanAmount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = loanTerm * 12;
    
    let result: any = {
      principal: principal,
      totalInterest: 0,
      totalPayment: 0,
      monthlyPayment: 0,
      paymentSchedule: []
    };

    if (paymentType === 'annuity') {
      // 等額本息 (Annuity)
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      result.monthlyPayment = monthlyPayment;
      
      let remainingPrincipal = principal;
      for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingPrincipal -= principalPayment;
        
        result.paymentSchedule.push({
          month,
          payment: monthlyPayment,
          interestPayment,
          principalPayment,
          remainingPrincipal: Math.max(0, remainingPrincipal)
        });
        
        result.totalInterest += interestPayment;
      }
      
      result.totalPayment = result.principal + result.totalInterest;
      
    } else {
      // 等額本金 (Straight-line)
      const monthlyPrincipal = principal / totalMonths;
      
      let remainingPrincipal = principal;
      let totalInterest = 0;
      let totalPayment = 0;
      
      for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const payment = monthlyPrincipal + interestPayment;
        
        remainingPrincipal -= monthlyPrincipal;
        totalInterest += interestPayment;
        totalPayment += payment;
        
        result.paymentSchedule.push({
          month,
          payment,
          interestPayment,
          principalPayment: monthlyPrincipal,
          remainingPrincipal: Math.max(0, remainingPrincipal)
        });
      }
      
      result.monthlyPayment = result.paymentSchedule[0].payment;
      result.totalInterest = totalInterest;
      result.totalPayment = result.principal + result.totalInterest;
    }
    
    setCalculationResult(result);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(value));
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">{t('tools.loanCalculator')}</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{t('tools.loanParameters')}</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>{t('tools.loanAmount')}</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>{t('tools.interestRate')} (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>{t('tools.loanTerm')} ({t('tools.years')})</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={loanTerm} 
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>{t('tools.paymentType')}</Form.Label>
                  <Form.Select 
                    value={paymentType} 
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option value="annuity">{t('tools.annuityPayment')}</option>
                    <option value="straightLine">{t('tools.straightLinePayment')}</option>
                  </Form.Select>
                </Form.Group>
                
                <Button variant="primary" onClick={calculateLoan}>
                  {t('tools.calculate')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          {calculationResult && (
            <Card>
              <Card.Body>
                <Card.Title>{t('tools.calculationResults')}</Card.Title>
                <div className="mb-3">
                  <p><strong>{t('tools.monthlyPayment')}:</strong> {formatCurrency(calculationResult.monthlyPayment)}</p>
                  <p><strong>{t('tools.totalPayment')}:</strong> {formatCurrency(calculationResult.totalPayment)}</p>
                  <p><strong>{t('tools.totalInterest')}:</strong> {formatCurrency(calculationResult.totalInterest)}</p>
                </div>
                
                <Card.Title>{t('tools.amortizationSchedule')}</Card.Title>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>{t('tools.month')}</th>
                        <th>{t('tools.payment')}</th>
                        <th>{t('tools.principal')}</th>
                        <th>{t('tools.interest')}</th>
                        <th>{t('tools.balance')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.paymentSchedule.slice(0, 24).map((payment: any) => (
                        <tr key={payment.month}>
                          <td>{payment.month}</td>
                          <td>{formatCurrency(payment.payment)}</td>
                          <td>{formatCurrency(payment.principalPayment)}</td>
                          <td>{formatCurrency(payment.interestPayment)}</td>
                          <td>{formatCurrency(payment.remainingPrincipal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LoanCalculator;