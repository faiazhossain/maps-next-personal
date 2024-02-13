import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai';
import { MdUpdate } from 'react-icons/md';
import UpdateInformationModal from './UpdateInformationModal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setDeleteReasonModalOpen, setSuggestModalOpen, setUpdateInfoModalOpen } from '@/redux/reducers/consumerReducer';
import DeleteReasonModal from './DeleteReasonModal';

const DeleteOrUpdate: React.FC = () => {
  const dispatch = useAppDispatch()

  // Redux states
  const suggestModalOpen: any = useAppSelector((state) => state?.consumer?.suggestModalOpen ?? false)

  const showModal = () => {
    dispatch(setSuggestModalOpen(true))
  };

  const handleCancel = () => {
    dispatch(setSuggestModalOpen(false))
  };

  const showUpdateModal = () => {
    dispatch(setUpdateInfoModalOpen(true))
    dispatch(setSuggestModalOpen(false))
  };
  
  const showDeleteModal = () => {
    dispatch(setDeleteReasonModalOpen(true))
    dispatch(setSuggestModalOpen(false))
  };

  return (
    <>
      <div className="suggestEditButton" onClick={showModal}>
        <AiTwotoneEdit style={{ marginRight: "6px" }} />
        <p>Suggest an edit</p>
      </div>

      <Modal title="Suggest an Edit" open={suggestModalOpen} footer={false} onCancel={handleCancel}>
        <div className='update_information' onClick={showUpdateModal}>
          <div style={{fontSize:'18px', marginRight:'10px'}}>
            <MdUpdate></MdUpdate>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p>Update Information</p>
            {/* <h4 style={{color: 'grey'}}>Change name or other details</h4> */}
          </div>
        </div>
        <div className='delete_information' onClick={showDeleteModal}>
          <div style={{fontSize:'18px', marginRight:'10px'}} >
            <AiTwotoneDelete></AiTwotoneDelete>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p>Delete or remove</p>
            {/* <h4 style={{color: 'grey'}}>Report a problem</h4> */}
          </div>
        </div>
      </Modal>
      {/* Render Update and Delete Modal */}
      <UpdateInformationModal />
      <DeleteReasonModal />
    </>
  );
};

export default DeleteOrUpdate;
