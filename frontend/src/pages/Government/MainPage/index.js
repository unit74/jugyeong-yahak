import React from "react";
import Nav from "../../Common/Nav";
import Banner from "../components/Banner";
import HelpTask from "../components/HelpTask";
import InformationCheck from "../../Common/InformationCheck";

const GovernmentMainPage = () => {
  return (
    <div>
      <Nav />
      <Banner />
      <HelpTask />
      <InformationCheck title="학생" id="Inf_Student" click="/governmentmain/studystudentpage" />
      <InformationCheck title="교사" id="Inf_Teacher" click="/governmentmain/studyteacherpage" />
      <InformationCheck title="학급" id="Inf_Cls" click="/governmentmain/studyclasspage" />
    </div>
  );
};

export default GovernmentMainPage;
