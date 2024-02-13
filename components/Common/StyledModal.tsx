import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Modal, Typography } from 'antd'

// Import Icons
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'

const StyledModal = ({ title, style, width, content, isOpen, onCancel, onOk, }: any) => (
    <Modal
        title={ <Typography style={ titleStyles }>{ title ?? '' }</Typography> }
        footer={ null }
        closeIcon={ <CloseCircleOutlined style={{ fontSize: '24px' }} /> }
        centered
        open={ isOpen }
        onOk={ onOk }
        onCancel={ onCancel }
        style={{ borderRadius: '10px 10px 0px 0px', ...style }}
        maskStyle={{ backdropFilter: 'blur(1.5px)' }}
        transitionName=""
        width={ width ?? 520 }
    >
        <div style={ containerStyles }>
          { content }
        </div>
    </Modal>
)

// JSX Styles
const containerStyles = {
    width: 'auto',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    gap: 32,
    margin: '0px 0px',
    padding: '8px 0px'
}

const titleStyles = {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '22px',
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    color: '#4C5976'
}

export default StyledModal
