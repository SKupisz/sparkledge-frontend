import React, {Suspense, useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useCookies} from "react-cookie";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

import { MainContainer, Preloader } from "../../styled/main";
import { LandingSectionWrapper, LandingSectionFilter, EndingBlock } from "../../styled/subpages/welcome";
import { UserPanelHeader, UserPanelWelcomeSection, UserPanelLastView ,
    UserPanelLastViewHeader, UserPanelLastViewGallery, UserPanelLastViewNoItemsHeader } from "../../styled/subpages/userpanel";

import LastViewItemComponent from "../helperComponents/userPanel/LastViewItemComponent";
import { RootState } from "../../redux/mainReducer";


const FooterComponent = React.lazy(() => import("../helperComponents/welcome/footerComponent"));

const Background = require("../../assets/pattern_background4_1.webp");

type LastViewItemType = {
    title: string,
    author: string,
    publishedOn: string
}

type LastPublishedItemType = {
    title: string,
    publishedOn: string,
    likes: number,
    views: number
}

const UserPanel:React.FC = () => {

    const [lastViewedList, setLastViewedList] = useState<LastViewItemType[]>([]);
    const [lastPublishedList, setLastPublishedList] = useState<LastPublishedItemType[]>([]);
    const currentToken:string = useSelector((state: RootState) => state.generalData.currentToken);
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(["userId"]);


    useEffect(() => {
        if(cookies["userId"] === undefined) navigate("/");
        else if(cookies["userId"] === undefined && currentToken.length === 0) navigate("/"); // the same logic is implemented twice, as there is risk that the cookies' content may not be uniform with the current state of application
    }, [currentToken, cookies])

    return <MainContainer className="block-center">
        <Suspense fallback={<Preloader className="block-center">Ładowanie...</Preloader>}>
            <LandingSectionWrapper className="block-center" source={Background} backgroundSize="initial"
                bottomPadding={0} backgroundRepeat="repeat">
                <LandingSectionFilter>
                    <UserPanelHeader className="block-center">
                        Panel użytkownika
                    </UserPanelHeader>
                    <UserPanelWelcomeSection className="block-center">
                        <UserPanelLastView width={60}>
                            <UserPanelLastViewHeader className="block-center">
                                Ostatnio przeglądane
                            </UserPanelLastViewHeader>
                            <UserPanelLastViewGallery className="block-center">
                                {
                                    lastViewedList.length > 0 ? lastViewedList.map((elem, ind) => <LastViewItemComponent key={`last-viewed-${ind}`}
                                    header={elem["title"]} secondHeader={`Autor: ${elem["author"]}`}
                                    additionalData={[[<PublishedWithChangesIcon style={{color: "inherit", fontSize: "1.3em", 
                                    verticalAlign: "top"}}/>, elem["publishedOn"]]]}/>) : <UserPanelLastViewNoItemsHeader className="block-center">
                                        Brak danych
                                    </UserPanelLastViewNoItemsHeader>
                                }
                            </UserPanelLastViewGallery>
                        </UserPanelLastView>
                        <UserPanelLastView width={40}>
                            <UserPanelLastViewHeader className="block-center">
                                Ostatnio publikowane
                            </UserPanelLastViewHeader>
                            <UserPanelLastViewGallery className="block-center">
                                {
                                    lastPublishedList.length > 0 ? lastViewedList.map((elem, ind) => <LastViewItemComponent key={`last-viewed-${ind}`}
                                    header={elem["title"]} secondHeader={`Autor: ${elem["author"]}`} 
                                    additionalData={[]}/>) : <UserPanelLastViewNoItemsHeader className="block-center">
                                        Brak danych
                                    </UserPanelLastViewNoItemsHeader>
                                }
                            </UserPanelLastViewGallery>
                        </UserPanelLastView>
                    </UserPanelWelcomeSection>
                    <EndingBlock/>
                </LandingSectionFilter>
            </LandingSectionWrapper>
            <FooterComponent/>
        </Suspense>
    </MainContainer>
}

export default UserPanel;