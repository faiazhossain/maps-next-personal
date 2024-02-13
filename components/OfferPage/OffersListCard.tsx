import {
  setIsOfferModalVisible,
  setOfferButtonClick,
  setOfferData,
} from "@/redux/reducers/mapReducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button, Card,Badge, Modal, Image, Divider, Row, Col } from "antd";
import { RiArrowGoBackFill } from "react-icons/ri";

const OffersList = () => {
  const dispatch = useAppDispatch();
  // redux state
  const nearByOffers: any = useAppSelector(
    (state: any) => state?.map?.nearByOffers
  );
  const isOfferModalVisible: any = useAppSelector(
    (state: any) => state?.map?.isOfferModalVisible
  );

  const handleClear = () => {
    // dispatch(setReverseGeoNearButton(false));
    dispatch(setOfferButtonClick(false));
  };

  const clickedOnCard = (index: any) => {
    dispatch(setIsOfferModalVisible(true));
    dispatch(setOfferData(nearByOffers?.data[index]))
    // setSelectedCardIndex(nearByOffers?.data[index]);
  };

  // Modal part

  const offerData: any = useAppSelector(
    (state: any) => state?.map?.offerData
  );

  // Create a function to hide the modal when the user closes it
  const handleCancel = () => {
    dispatch(setIsOfferModalVisible(false));
  };

  // company offer data
  const companyOffers = [
    { 
      title: offerData && offerData?.offer_name,
      discount_value: offerData && offerData?.discount_value,
      discount_type: offerData && offerData?.discount_type === 'PERCENT' ? '%' : offerData?.discount_type === 'BOGO' ? 'Buy 1 get 1' : "৳",
      payment_type_name: offerData && offerData?.payment_type_name,
      offer_description: offerData && offerData?.offer_description,
      cards: offerData && offerData?.card ? offerData && offerData?.card.split(',').map((card: string) => card.trim()) : [],
    },
  ];


  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
          { nearByOffers?.data.length!==0 ? <Card
          className="_width_lg searchbarDetails"
          style={{ display: "flex", justifyContent: "center", 
          height: nearByOffers?.data.length >= 6 ? `92vh` : 'auto',          
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative", 
          zIndex:'120'
        }}
        >
           <div
            style={{
              position: "relative",
              zIndex: 100,
              margin: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                padding: "10px 22px",
                borderRadius: "10px",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  padding: "10px 0px",
                  color: "#E55604",
                  borderRadius: 10,
                }}
              >
                Nearby Offers!
              </h3>
              <Button
                style={{ border: "1px solid #32a66b" }}
                onClick={handleClear}
                icon={
                  <RiArrowGoBackFill
                    style={{ color: "#32a66b", fontSize: "18px" }}
                  />
                }
              ></Button>
            </div>
            {nearByOffers &&
              nearByOffers?.data?.map(
                (data: any, index: any) => (
                  <Card
                    style={{ cursor: "pointer", position:'relative' }}
                    onClick={() => clickedOnCard(index)}
                    key={index}
                    className="_width_lg card_hover"
                  >
                <Badge.Ribbon  style={{position:'absolute',top:'-18px', width:'30%'}} text={`${data.discount_type !=='BOGO'?data.discount_value:''}${data.discount_type === "PERCENT" ? "% discount" : data.discount_type ==='BOGO'?'Buy 1 get 1' : "৳"}`} key={index} color={`${data.discount_type !=='BOGO'?'red':'#FF9130'}`}>
                    <h5>{data.business_name}</h5>
                    <h4>{data.offer_name}</h4>
                </Badge.Ribbon>
                  </Card>
                )
              )}
          </div>
        </Card> 
        
        : 
        
        <Card
          className="_width_lg"
        >
           <div
            style={{
              position: "relative",
              zIndex: 100,
              margin: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                padding: "10px 22px",
                borderRadius: "10px",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  padding: "10px 0px",
                  color: "#E55604",
                  borderRadius: 10,
                }}
              >
                No Nearby Offers found!
              </h3>
              <Button
                style={{ border: "1px solid #32a66b" }}
                onClick={handleClear}
                icon={
                  <RiArrowGoBackFill
                    style={{ color: "#32a66b", fontSize: "18px" }}
                  />
                }
              ></Button>
            </div>
          </div>
        </Card>}

        {/* Modal part */}
        {/* Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} */}
        <Modal
        // title="Company Offers"
        open={isOfferModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <h2 style={{color:'#435585',marginBottom:'20px'}}>{offerData?.business_name}</h2>
        {companyOffers.map((offer, index) => (   
            // <Badge.Ribbon text={`${offer.discount_value}${offer.discount_type}`} key={index} color="red">
              <Card key={index} title={offer.title} style={{ marginBottom: '16px' }}>
                <h2>This offer only available for <span style={{color:'#435585'}}>{offer.payment_type_name} </span>users!</h2>
                <Row style={{display:'flex', alignItems:'center'}}>
                  <Col span={9}>
                  <h3>We are accepting: </h3>
                  </Col>
                  <Col span={13}>
                    <div style={{display:'flex', flexWrap:'wrap'}}>
                      {offer.cards.map((card:any, cardIndex:any) => (
                        <div style={{marginRight:'10px', marginTop:'10px'}} key={cardIndex}>
                          <Image width={50} height={30} preview={false} src={
                            card === 'VISA' ? '/images/visa.png' :
                            card === 'MASTER' ? '/images/mastercard.webp' :
                            card === 'AMEX' ? '/images/amex.png' :
                            card === 'BKASH' ? '/images/bkash.webp' :
                            card === 'NAGAD' ? '/images/nagad.webp' :
                            '/images/default-card.jpg' // Provide a default image if the card type is unknown
                          }  alt=''></Image>
                        </div>
                      ))}
                    </div>
                  </Col>
               </Row>
               <Divider></Divider>
               <h2 style={{color:"#E55604",background: "#FFE3BB", textAlign:'center'}}>{offer?.discount_value}{offer?.discount_type==='Buy 1 get 1'?'':offer?.discount_type} {offer?.discount_type==='Buy 1 get 1'?'':'discount'}</h2>         
               <Divider></Divider>
               {offer?.offer_description && <h4 style={{color:"#435585"}}>Offer Description</h4>}
                    <div>{offer?.offer_description}</div>
              </Card>
            // </Badge.Ribbon> 
        ))}

      </Modal>
    </div>
  );
};
export default OffersList;
