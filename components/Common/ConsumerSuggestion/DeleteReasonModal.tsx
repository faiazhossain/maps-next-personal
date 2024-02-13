import React, { useState } from 'react';
import { Button, Modal, Input, Form, message } from 'antd';
import { AiTwotoneEdit } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setDeleteReasonModalOpen, setUpdateInfoModalOpen } from '@/redux/reducers/consumerReducer';
import { updatePlaceInformation } from '@/redux/actions/consumerAction';

// Import constants
const { Item } = Form

const DeleteReasonModal: React.FC = () => {

  const [form] = Form.useForm()

  // const [isModalOpen, setIsModalOpen] = useState(isOpen);
  // const [formData, setFormData] = useState({ input1: '', input2: '', input3: '' });

  // Redux States
  const dispatch = useAppDispatch()
  const deleteReasonModalOpen: any = useAppSelector((state) => state?.consumer?.deleteReasonModalOpen ?? false)

  const handleOk = () => {
    // setIsModalOpen(false);
    dispatch(setDeleteReasonModalOpen(false))
  };

  const handleCancel = () => {
    // setIsModalOpen(false);
    dispatch(setDeleteReasonModalOpen(false))
  };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

   // On finish form
   const _onFinish = (values: any) => {
    const data: any = {
      ...values,
      request_type: 'DELETE'
    }

    updatePlaceInformation(data)
      .then((res:any) => {
        if (res?.status === 200) {
          dispatch(setDeleteReasonModalOpen(false))
          message.success({ content: res?.data?.message })
        }
        if (res?.response?.data?.status_code === 422) {
          message.error({ content: res?.response?.data?.message })
        }
        if (res?.response?.status === 500) {
          message.error({ content: res?.response?.data?.message })
        }
      })
      .catch((err) => {
        message.error({ content: err?.response?.data?.message })
      })
  }

  return (
    <>
      <Modal
        title="Close or remove"
        open={deleteReasonModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={ form }
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          onFinish={ _onFinish }
        >
          <Item
            name="reason"
            label="Give a reason"
          >
            <Input />
          </Item>
          <Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', height: '32px', backgroundColor: 'rgb(50, 166, 107)' }}
            >
              UPDATE
            </Button>
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeleteReasonModal;
