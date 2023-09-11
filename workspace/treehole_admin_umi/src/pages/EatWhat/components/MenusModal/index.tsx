import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Modal, Tag } from 'antd';
//@ts-ignore
import { TweenOneGroup } from 'rc-tween-one';
import React, { useEffect, useRef, useState } from 'react';

interface IMenusModal {
  menus: string[];
  isOpen: boolean;
  handleUpdateMenus: (menus: string[]) => void;
}

const MenusModal: React.FC<IMenusModal> = ({ menus, handleUpdateMenus, isOpen }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClose = (removedTag: string) => {
    const newMenus = menus.filter((tag) => tag !== removedTag);
    handleUpdateMenus(newMenus);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && menus.indexOf(inputValue) === -1) handleUpdateMenus([...menus, inputValue]);
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = menus.map(forMap);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  return (
    <>
      <Button icon={<FileTextOutlined onClick={showModal} />} disabled={isOpen}></Button>
      <Modal title="Menus" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
            }}
            onEnd={(e: any) => {
              if (e.type === 'appear' || e.type === 'enter') {
                (e.target as any).style = 'display: inline-block';
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag onClick={showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </Modal>
    </>
  );
};

export default MenusModal;
