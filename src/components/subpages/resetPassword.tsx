import React, { Suspense, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";

import { MainContainer } from "src/styled/main";
import { LandingSectionWrapper, LandingSectionFilter } from "src/styled/subpages/welcome";
import {
  ForgotPasswordContainer, ForgotPasswordHeader, ForgotPasswordDescription,
  ForgotPasswordEmailInput, 
  ForgotPasswordSubmitBtn,
  ForgotPasswordErrorHeader,
  ForgotPasswordSuccessDescription,
} from "src/styled/subpages/forgotPassword";

import { ForgotPasswordButton, ErrorLabel } from "src/styled/subpages/signing";

import BackgroundPattern from "src/assets/pattern_background4_1.webp";
import resetPassword from "src/connectionFunctions/forgotPassword/resetPassword";
import SearchingPreloaderComponent from "../helperComponents/searcher/searchingPreloaderComponent";

import checkIfPasswordIsStrong from "../auxiliaryFunctions/forgotPassword/checkIfPasswordIsStrong";

const FooterComponent = React.lazy(() => import("src/components/helperComponents/welcome/footerComponent"));

const ResetPassword:React.FC = () => {
  const [passwd, setPasswd] = useState<string>("");
  const [passwdRep, setPasswdRep] = useState<string>("");
  const [resetState, setResetState] = useState<number>(0); // 0 - start, 1 - success, 2 - error

  const [memoryUserId, setMemoryUserId] = useLocalStorage<string>("u", "");

  const { email, token } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (email === undefined || token === undefined) navigate("/signin");
    else if (memoryUserId !== undefined && memoryUserId.length > 0) navigate("/panel");
  }, []);

  useEffect(() => {
    if (resetState === 1) navigate("/signin");
  }, [resetState]);

  return (
    <MainContainer className="block-center">
      <Suspense fallback={<SearchingPreloaderComponent />}>
        <LandingSectionWrapper
          className="block-center"
          backgroundSize="initial"
          source={BackgroundPattern}
          backgroundRepeat="repeat"
        >
          <LandingSectionFilter>
            <ForgotPasswordContainer className="block-center">
              {resetState === 0 ? (
                <>
                  <ForgotPasswordHeader className="block-center">
                    Reset has??a
                  </ForgotPasswordHeader>
                  <ForgotPasswordEmailInput
                    type="password"
                    placeholder="Nowe has??o..."
                    className="block-center"
                    value={passwd}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswd(e.currentTarget.value)}
                  />
                  <ForgotPasswordEmailInput
                    type="password"
                    placeholder="Powt??rz has??o..."
                    className="block-center"
                    value={passwdRep}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswdRep(e.currentTarget.value)}
                    isSecondPhase
                  />
                  {passwd.length > 0 && passwdRep.length > 0 && checkIfPasswordIsStrong(passwd) && passwd === passwdRep ? (
                    <ForgotPasswordSubmitBtn
                      type="button"
                      onClick={() => email !== undefined && token !== undefined 
                        ? resetPassword(email, token, passwd, setResetState) : {}}
                    >
                      Zmie?? has??o
                    </ForgotPasswordSubmitBtn>
                  ) : passwd.length > 0 && !checkIfPasswordIsStrong(passwd)
                    ? (
                      <ErrorLabel isUsedForReset className="block-center">
                        Has??o powinno mie?? d??ugo???? co najmniej 8 znak??w, jedn?? ma???? i jedn?? wielk?? liter??
                      </ErrorLabel>
                    ) : passwdRep.length > 0 && passwd !== passwdRep ? (
                      <ErrorLabel isUsedForReset className="block-center">
                        Has??a nie s?? identyczne
                      </ErrorLabel>
                    ) : null}
                </>
              ) : (
                <ForgotPasswordErrorHeader className="block-center">
                  {resetState === 1 ? "Has??o zosta??o zmienione. Przejd?? do logowania" : "Co?? posz??o nie tak. Spr??buj ponownie p????niej"}
                </ForgotPasswordErrorHeader>
              )}
            </ForgotPasswordContainer>
          </LandingSectionFilter>
        </LandingSectionWrapper>
        <FooterComponent />
      </Suspense>
    </MainContainer>
  );
};

export default ResetPassword;
