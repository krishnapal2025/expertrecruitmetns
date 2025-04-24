import React from "react";
import erLogoPath from "@assets/ER LOGO New.png";

const ExpertRecruitmentsBanner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-primary/5">
      <div className="max-w-lg text-center">
        <div className="mb-8">
          <img src={erLogoPath} alt="Expert Recruitments Logo" className="h-16 mx-auto" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Expert Recruitments</h2>
        <p className="text-lg opacity-90 mb-8">
          The Home of High-End Executive Search in Dubai. From executive search in the UAE to focused
          headhunting across the region, we help organizations find exceptional talent.
        </p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Dedicated specialized teams working across industry verticals</p>
          <p>Extensive talent mapping and market intelligence capabilities</p>
          <p>Customized search strategies for each assignment</p>
          <p>Deep understanding of regional market dynamics</p>
        </div>
      </div>
    </div>
  );
};

export default ExpertRecruitmentsBanner;