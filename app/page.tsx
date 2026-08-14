import ProjectLabel from "@/components/ui/ProjectLabel";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import Hero from "@/components/hero/Hero";
import OpticsSection from "@/components/editorial/OpticsSection";
import SensorSection from "@/components/editorial/SensorSection";
import EngineeringSection from "@/components/editorial/EngineeringSection";
import LensSection from "@/components/editorial/LensSection";
import BodySection from "@/components/editorial/BodySection";
import Specifications from "@/components/editorial/Specifications";
import FinalProduct from "@/components/editorial/FinalProduct";
import Footer from "@/components/footer/Footer";

export default function Page() {
  return (
    <>
      <ProjectLabel />
      <ScrollIndicator />
      <Hero />
      <OpticsSection />
      <SensorSection />
      <EngineeringSection />
      <LensSection />
      <BodySection />
      <Specifications />
      <FinalProduct />
      <Footer />
    </>
  );
}
