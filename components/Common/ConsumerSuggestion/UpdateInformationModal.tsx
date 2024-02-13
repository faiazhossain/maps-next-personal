import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Upload, message, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setUpdateInfoModalOpen } from '@/redux/reducers/consumerReducer';
import { PlusOutlined } from '@ant-design/icons';
import { updatePlaceInformation } from '@/redux/actions/consumerAction';

// Import constants
const { Item } = Form

const UpdateInformationModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()

  // Redux states
  const updateInfoModalOpen: any = useAppSelector((state) => state?.consumer?.updateInfoModalOpen ?? false)
  const reverseGeoCode: any = useAppSelector((state: any) => state?.map?.reverseGeoCode);

  // Initialize the state with values from reverseGeoCode.place.address
  // const [formData, setFormData] = useState({
  //   field1: reverseGeoCode.place.address || '',
  //   field2: reverseGeoCode.place.address || '',
  //   // Add more fields as needed
  // });

  // const handleInputChange = (fieldName: string, value: string) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [fieldName]: value,
  //   }));
  // };

  // useEffect(() => {
  //   // Update the form fields if reverseGeoCode data changes
  //   setFormData({
  //     field1: reverseGeoCode.place.address || '',
  //     field2: reverseGeoCode.place.address || '',
  //     // Update more fields as needed
  //   });
  // }, [reverseGeoCode]);

  const handleCancel = () => {
    dispatch(setUpdateInfoModalOpen(false))
  };

  const getBase64 = (file:any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([])

  const handleCancelImage = () => setPreviewOpen(false);
  const handlePreview = async (file:any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }:any) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const _onFillForm = (data: any, value: any) => {
    const phoneNumber = JSON.parse(data?.places_additional_data)
    form.setFieldsValue({
      ...data,
      contact: phoneNumber?.contact?.phone,
    })
    
  }

   // On finish form
  const _onFinish = (values: any) => {
    const data: any = {
      // ...reverseGeoCode?.place,
      ...values,
      // images: fileList,
      request_type: 'UPDATE'
    }

    updatePlaceInformation(data)
      .then((res:any) => {
        if (res?.status === 200) {
          dispatch(setUpdateInfoModalOpen(false))
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

  useEffect(() => {
    _onFillForm(reverseGeoCode?.place, form)
  }, [reverseGeoCode, form])

  return (
    <Modal 
      className='updateSuggestionModal'
      title="Suggest an edit"
      open={updateInfoModalOpen}
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
          name="place_name"
          label="Place Name in English"
        >
          <Input />
        </Item>
        <Item
          name="business_name"
          label="Business Name in English"
        >
          <Input />
        </Item>
        <Item
          name="address"
          label="Address"
        >
          <Input />
        </Item>
        <Row gutter={[20,0]}>
          <Col span={12}>
            <Item
              name="holding_number"
              label="Holding Number"
            >
              <Input />
            </Item>
          </Col>
          <Col span={12}>
            <Item
              name="road_name_number"
              label="Road Name/Number"
            >
              <Input />
            </Item>
          </Col>
        </Row>
        <Row gutter={[20,0]}>
          <Col span={12}>
            <Item
              name="thana"
              label="Thana"
            >
              <Input />
            </Item>
          </Col>
          <Col span={12}>
            <Item
              name="postcode"
              label="Postcode"
            >
              <Input />
            </Item>
          </Col>
        </Row>
        {/* <Item
          name="contact"
          label="Contact"
          // rules={ [
          //   { pattern: /^(?!01(\+880|\+|8|88|880|00))01\d{9}$/, message: 'Invalid Contact Number' }
          // ] }
        >
          <Input />
        </Item> */}
        {/* <Item name="images">
          <Upload
            // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 7 ? null : uploadButton}
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelImage}>
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </Modal>
        </Item> */}
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
  );
};

export default UpdateInformationModal;

