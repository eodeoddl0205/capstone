import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
`;

const CloseButtonTop = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
`;

const Content = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 20px 0;
`;

const CloseButtonBottom = styled.button`
  font-size: 16px;
  color: black;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  float: right;
  margin-top: 20px;
  margin-right: 15px;
`;

const EventButtonBottom = styled.button`
  font-size: 16px;
  color: #fff;
  background-color: #2464E0;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  float: right;
  margin-top: 20px;
`;

interface ModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onCofirm: () => void;
  modalbutton : {
    check: {
      text: string;
      view: boolean;
    },
    close: {
      text: string;
      view: boolean;
      reload : boolean;
    }
  }
}

const CustomModal: React.FC<ModalProps> = ({ title, content, isOpen, onClose, onCofirm, modalbutton }) => {
  return (
    <Modal open={isOpen} onClose={onClose} center closeIcon={<span />} styles={{
      modal: {
        borderRadius: '8px',
        maxHeight : '90%',
        maxWidth : '90%'
      }
    }}>
      <Header>
        <Title>{title}</Title>
        <CloseButtonTop onClick={onClose}>&times;</CloseButtonTop>
      </Header>
      <Content>{content}</Content>
      {modalbutton.check.view && <EventButtonBottom onClick={onCofirm}>{modalbutton.check.text}</EventButtonBottom>}
      {modalbutton.close.view && <CloseButtonBottom onClick={modalbutton.close.reload ? () => {window.location.replace("/")} : onClose }>{modalbutton.close.text}</CloseButtonBottom>}
    </Modal>
  );
};

export default CustomModal;