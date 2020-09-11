/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiDollarSign, FiType, FiShuffle, FiCopy } from 'react-icons/fi';
import { useParams } from 'react-router';

import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';
import formatValue from '../../utils/formatValue';

import { Container } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

const EditTransaction: React.FC = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<Transaction>();
  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    async function loadTransaction(): Promise<void> {
      const response = await api.get(`/transactions/${id}`);

      setTransaction(response.data);
    }
    loadTransaction();
  }, []);

  const handleEdit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        title: Yup.string().notRequired(),
        value: Yup.string(),
        type: Yup.string()
          .equals(['income', 'outcome'], 'O tipo deve ser income ou outcome')
          .notRequired(),
        category: Yup.string().notRequired(),
      });

      const transactionValidate = await schema.validate(data, {
        abortEarly: false,
      });

      await api.put(`/transactions/${id}`, transactionValidate);

      window.location.href = '/';
    } catch (err) {
      const errors = getValidationErrors(err);

      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Form ref={formRef} onSubmit={handleEdit}>
          <h1>Edite sua transação</h1>
          <Input
            icon={FiType}
            name="title"
            placeholder={transaction?.title}
            type="text"
          />
          <Input
            icon={FiDollarSign}
            name="value"
            placeholder={formatValue(Number(transaction?.value))}
            type="text"
          />
          <Input
            icon={FiShuffle}
            name="type"
            placeholder={transaction?.type}
            type="text"
          />
          <Input
            icon={FiCopy}
            name="category"
            placeholder={transaction?.category?.title}
            type="text"
          />
          <Button type="submit">Editar</Button>
        </Form>
      </Container>
    </>
  );
};

export default EditTransaction;
