import React, {Suspense} from "react";

import { MainContainer, Preloader } from "../../styled/main";
import { LandingSectionWrapper, LandingSectionFilter } from "../../styled/subpages/welcome";
import { AboutHeader, AboutDesc } from "../../styled/subpages/about";


const TeamWidgetsSection = React.lazy(() => import("../helperComponents/about/TeamWidgetsSection"));
const FooterComponent = React.lazy(() => import("../helperComponents/welcome/footerComponent"));
const BackgroundPattern = require("../../assets/pattern_background.webp");

const About:React.FC = () => {

    return <MainContainer className="block-center">
        <Suspense fallback={<Preloader className="block-center">Ładowanie...</Preloader>}>
            <LandingSectionWrapper className="block-center" source={BackgroundPattern} backgroundSize="contain">
                <LandingSectionFilter>
                    <AboutHeader className="block-center">
                        O nas
                    </AboutHeader>
                    <AboutDesc className="block-center">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex consequuntur incidunt repellendus delectus fugiat sit ut dolores perferendis aperiam aliquid quaerat accusamus itaque maiores atque impedit autem sequi, soluta ullam.    
                    </AboutDesc>
                    <TeamWidgetsSection/>
                </LandingSectionFilter>
            </LandingSectionWrapper>
            <FooterComponent/>
        </Suspense>
    </MainContainer>
};

export default About;