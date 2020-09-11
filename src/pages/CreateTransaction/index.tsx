/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef, useCallback } from 'react';
import { FiDollarSign, FiType, FiShuffle, FiCopy } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

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

const CreateTransaction: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        title: Yup.string().required('O título é obrigatório'),
        value: Yup.number().required('O valor é obrigatório'),
        type: Yup.string().equals(
          ['income', 'outcome'],
          'O tipo deve ser income ou outcome',
        ),
        category: Yup.string().required('A categoria é obrigatória'),
      });

      const transaction = await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/transactions', transaction);

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
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Crie uma nova transação</h1>
          <Input icon={FiType} name="title" placeholder="Título" type="text" />
          <Input
            icon={FiDollarSign}
            name="value"
            placeholder="Valor"
            type="text"
          />
          <Input icon={FiShuffle} name="type" placeholder="Tipo" type="text" />
          <Input
            icon={FiCopy}
            name="category"
            placeholder="Categoria"
            type="text"
          />
          <Button type="submit">Criar Transação</Button>
        </Form>
      </Container>
    </>
  );
};

export default CreateTransaction;
