import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useLocalStorage from "use-local-storage";

import { MainContainer, Preloader } from "../../styled/main";
import { LandingSectionWrapper, LandingSectionFilter } from "../../styled/subpages/welcome";
import { AboutHeader } from "../../styled/subpages/about";
import {
  SigningPanelWrapper, SigningPanelInput, SigningPanelButton,
  ErrorLabel, 
  ForgotPasswordButton,
} from "../../styled/subpages/signing";

import TriggerTheShot from "../../connectionFunctions/signin/sendSigningData";

import { setNewToken } from "../../redux/actions/generalActions";
import { RootState } from "../../redux/mainReducer";

interface SigningInterface {
  mode: number
}

const BackgroundPattern = require("../../assets/pattern_background4_1.webp");

const FooterComponent = React.lazy(() => import("../helperComponents/welcome/footerComponent"));

const SigningPanel:React.FC<SigningInterface> = ({ mode }: SigningInterface) => {
  const [Login, setLogin] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userSurname, setUserSurname] = useState<string>("");
  const [isSuccess, toggleIsSuccess] = useState<boolean>(false);
  // const [isVerificationSuccessful, toggleIsVerificationSuccessful] = useState<number>(0); // 0 - status unknown, 1 - verified, 2 - verification failed
  const [Password, setPassword] = useState<string>("");
  const [RepeatedPassword, setRepeatedPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [memoryUserId, setMemoryUserId] = useLocalStorage<string>("u", "");
  const [refreshUserId, setRefreshUserId] = useLocalStorage<string>("u_r", "");
  const currentToken:string = useSelector((state:RootState) => state.generalData.currentToken);
    
  const navigate = useNavigate();
  const dispatch = useDispatch();
    
  const useQuery:any = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const sendTheData = () => {
    TriggerTheShot(
      mode, 
      toggleIsSuccess, 
      Login, 
      Password, 
      userName, 
      userSurname,
      setError, 
      setPassword, 
      setLogin, 
      (newToken: string) => {
        setMemoryUserId(newToken);
        dispatch(setNewToken(newToken));
      }, 
      setRefreshUserId, 
      navigate,
    );
  };

  useEffect(() => {
    // toggleIsVerificationSuccessful(0);
    toggleIsSuccess(false);
    if (currentToken.length > 0 || memoryUserId.length > 0) navigate("/panel");
    // const verifyCode:string = query.get("verifyemail");
    // if (verifyCode !== null && verifyCode.length > 0) toggleIsVerificationSuccessful(1);// verifyEmail(verifyCode, toggleIsVerificationSuccessful, toggleIsSuccess);
  }, [currentToken]);

  return (
    <MainContainer className="block-center">
      <Suspense fallback={<Preloader className="block-center">??adowanie...</Preloader>}>
        <LandingSectionWrapper
          className="block-center"
          source={BackgroundPattern}
          backgroundSize="initial"
          bottomPadding={10}
          backgroundRepeat="repeat"
        >
          <LandingSectionFilter>
            <AboutHeader className="block-center">
              { mode === 1 
                ? "Panel logowania" : isSuccess === false 
                  ? "Panel rejestracji" : "Potwierd?? rejestracj?? klikaj??c w link wys??any na podany adres e-mail"}    
            </AboutHeader>
            {
                        (mode === 2 && isSuccess) ? null : (
                          <SigningPanelWrapper className="block-center">
                            <SigningPanelInput
                              className="block-center"
                              type={mode === 1 ? "text" : "email"}
                              placeholder={mode === 1 ? "Login..." : "Email..."}
                              value={Login}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                              required
                              marginBottom={mode === 2 ? 1 : 2}
                            />
                            {
                                mode === 2 ? (
                                  <>
                                    <SigningPanelInput
                                      className="block-center"
                                      type="text"
                                      placeholder="Imi??..."
                                      marginBottom={1}
                                      value={userName}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.currentTarget.value)}
                                      required
                                    />
                                    <SigningPanelInput
                                      className="block-center"
                                      type="text"
                                      placeholder="Nazwisko..."
                                      marginBottom={1}
                                      value={userSurname}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserSurname(e.currentTarget.value)}
                                      required
                                    />
                                
                                  </>
                                ) : null
                            }
                            <SigningPanelInput
                              className="block-center"
                              type="password"
                              placeholder="Has??o..."
                              marginBottom={mode === 1 ? 20 : 1}
                              value={Password} 
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)} 
                              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && mode === 1 ? sendTheData() : null}
                              required
                            />
                            {
                            
                            mode === 2 ? (
                              <SigningPanelInput
                                className="block-center"
                                type="password"
                                placeholder="Powt??rz has??o..."
                                marginBottom={10}
                                value={RepeatedPassword} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatedPassword(e.target.value)}
                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && mode === 2 ? sendTheData() : null}
                                required
                              />
                            ) : null
                        }
                            <SigningPanelButton className="block-center" onClick={() => sendTheData()}>
                              {mode === 1 ? "Zaloguj" : "Zarejestruj"}
                              {" "}
                              si??    
                            </SigningPanelButton>
                            {
                              mode === 1 ? (
                                <Link to="/forgotPassword">
                                  <ForgotPasswordButton className="block-center">
                                    Nie pami??tam has??a
                                  </ForgotPasswordButton>
                                </Link>
                              ) : null
                            }
                            {
                            error.length > 0 ? (
                              <ErrorLabel className="block-center">
                                {error}
                              </ErrorLabel>
                            ) : null
                        }
                          </SigningPanelWrapper>
                        )
                    }
          </LandingSectionFilter>
        </LandingSectionWrapper>
        <FooterComponent />
      </Suspense>
    </MainContainer>
  );
};

export default SigningPanel;
