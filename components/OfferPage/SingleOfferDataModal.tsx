import React, { useState } from 'react';
import { Badge, Button, Card, Col, Divider, Image, Modal, Row } from 'antd';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setSingleOfferData, setSingleOfferModalOpen } from '@/redux/reducers/mapReducer';

const SingleOfferData: React.FC = () => {
  // const [isSingleOfferModalOpen, setIsSingleModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isSingleModalOpen: any = useAppSelector(
    (state: any) => state?.map?.singleOfferModalOpen
  );  
  
  const singleOffers: any = useAppSelector(
    (state: any) => state?.map?.singleOfferData?.data
  );
  
  const handleCancel = () => {
    dispatch(setSingleOfferData(null));
    dispatch(setSingleOfferModalOpen(false))
  };

  // company offer data
  // const companyOffers = [
  //   { 
  //     title: offerData && offerData?.offer_name,
  //     discount_value: offerData && offerData?.discount_value,
  //     discount_type: offerData && offerData?.discount_type === 'PERCENT' ? '%' : 'Taka',
  //     payment_type_name: offerData && offerData?.payment_type_name,
  //     cards: offerData && offerData?.card ? offerData && offerData?.card.split(',').map((card: string) => card.trim()) : [],
  //   },
  // ];

// Assuming singleOffers.card is "VISA, MASTER"
const cardString = singleOffers?.card;

// Split the string into an array using the comma as a delimiter
const cardArray = cardString?.split(', ');


  return (
    <>
      {singleOffers ? <Modal footer={false} open={isSingleModalOpen} onCancel={handleCancel}>
      <h2 style={{color:'#435585',marginBottom:'20px'}}>{singleOffers?.business_name}</h2>
            <Badge.Ribbon text={`${singleOffers.discount_type!=='BOGO'? singleOffers?.discount_value:''}${singleOffers.discount_type=== 'PERCENT' ?'%':singleOffers.discount_type==='BOGO'?'Buy 1 get 1' : "৳"}`} color="red">
              <Card  title={singleOffers.title} style={{ marginBottom: '16px' }}>
                <h2>This offer only available for <span style={{color:'#435585'}}>{singleOffers.payment_type_name} </span>users!</h2>
                <Row style={{display:'flex', alignItems:'flex-end'}}>
                  <Col span={8}>
                  <h3>We are accepting</h3>
                  </Col>
                  <Col span={14}>
                  <div style={{marginRight:'10px'}}>
                      {cardArray?.map((card:any, cardIndex:any) => (
                        // <p key={cardIndex}>{card==='visa'}</p>
                        <Image width={50} height={36} preview={false} key={cardIndex} src={
                          card === 'VISA' ? '/images/visa.png' :
                          card === 'MASTER' ? '/images/mastercard.webp' :
                          card === 'AMEX' ? '/images/amex.png' :
                          card === 'BKASH' ? '/images/bkash.webp' :
                          card === 'NAGAD' ? '/images/nagad.webp' :
                          '/images/default-card.jpg' // Provide a default image if the card type is unknown
                        } alt=''></Image>
                        ))}
                    </div>
                    </Col>
               </Row>

               <Divider></Divider>
                 <h2 style={{color:"#E55604",background: "#FFE3BB", textAlign:'center'}}>{singleOffers.discount_type!=='BOGO'?singleOffers?.discount_value:''}{singleOffers.discount_type=== 'PERCENT' ? "%": singleOffers.discount_type==='BOGO'?'Buy 1 get 1': "৳"} discount</h2>         
               <Divider></Divider>
               {singleOffers?.offer_description && <h4 style={{color:"#435585"}}>Offer Description</h4>}
                    <div>{singleOffers?.offer_description}</div>
              </Card>
            </Badge.Ribbon> 
            </Modal>
            :
            <Modal footer={false} open={isSingleModalOpen} onCancel={handleCancel}>
                    <h1>No offers Available</h1>
            </Modal>
          }
    </>
  );
};

export default SingleOfferData;