import IndividualMemberRegistration from "./IndividualMemberRegistration";
import CorporateMemberRegistration from "./CorporateMemberRegistration";

const AddSingleMember = ({
  validationSchema,
  initialValues,
  onSubmit,
  isLogin,
  setIsLogin,
  memberType,
  setMemberType,
  changeHandler
}) => {

  const getMemberType = () => {
    if (memberType === "individual") {
      return (
        <IndividualMemberRegistration
        inputHandler={changeHandler}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          memberType={memberType}
          setMemberType={setMemberType}
        />
      );
    } else{
      return <CorporateMemberRegistration  
      memberType={memberType}
      setMemberType={setMemberType}
       />;
    }
  };
  return <>{getMemberType()}</>;
};

export default AddSingleMember;
