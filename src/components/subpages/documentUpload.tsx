import React, { useState, useEffect, createRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SwipeRightAltIcon from "@mui/icons-material/SwipeRightAlt";

import { MainContainer } from "src/styled/main";
import { LandingSectionWrapper, LandingSectionFilter } from "src/styled/subpages/welcome";
import {
  DocumentUploadFormWrapper, DocumentUploadFormHeader,
  DocumentUploadFormDataSection, DocumentUploadNotWorking, DocumentUploadTextInput,
  DocumentUploadNextButton, DocumentUploadDataSubSection, DocumentUploadFileHeader, DocumentUploadFileInput,
  DocumentUploadFileDescription, DocumentUploadFileButton, 
} from "src/styled/subpages/documentUpload";

import { RootState } from "../../redux/mainReducer";

import sendFile from "../../connectionFunctions/documentUpload/sendFile";
import getUniversitySubInfrastructure from "../../connectionFunctions/searcher/getUniversitySubInfrastructure";
import loadUniversities from "../../connectionFunctions/documentUpload/loadUniversities";
import SearchingParametersPicker from "../helperComponents/documentUpload/searchingParametersPicker";
import SearchingPreloaderComponent from "../helperComponents/searcher/searchingPreloaderComponent";

import selectFile from "../auxiliaryFunctions/documentUpload/selectFile";

const BackgroundPattern = require("../../assets/pattern_background5.webp");

const DocumentUpload:React.FC = () => {
  const currentToken:string = useSelector((state: RootState) => state.generalData.currentToken);

  const [isWorking, toggleIsWorking] = useState<boolean>(true);
  const [isSending, toggleIsSending] = useState<boolean>(false);
  const [isOnline, toggleIsOnline] = useState<boolean>(window.navigator.onLine);
  const [phaseNumber, setPhaseNumber] = useState<number>(1); // 1 - name, 2 - category 3- file & upload, 4 - file uploaded
  const [materialName, setMaterialName] = useState<string>("");
  const [file, setFile] = useState<any>(null);
  const [isFileLoaded, setIsFileLoaded] = useState<number>(0); // 0 - status unknown, 1 - loaded, 2 - problems occured
  const [desc, setDesc] = useState<string>("");
  const [warning, setWarning] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
    
  const [universitiesList, setUniversitiesList] = useState<any[]>([]);
  const [facultiesList, setFacultiesList] = useState<any[]>([]);
  const [programmesList, setProgrammesList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  const [searchedUniversity, setSearchedUniversity] = useState<string>("");
  const [searchedFaculty, setSearchedFaculty] = useState<string>("");
  const [searchedType, setSearchedType] = useState<string>("");
  const [searchedProgramme, setSearchedProgramme] = useState<string>("");
  const [searchedSemester, setSearchedSemester] = useState<number>(0); // 0 - nothing chosen
  const [searchedCourse, setSearchedCourse] = useState<string>("");
  const [searchedTypeOfSubject, setSearchedTypeOfSubject] = useState<string>("");

  const FileRef = createRef<HTMLInputElement>();

  useEffect(() => {
    loadUniversities(setUniversitiesList, toggleIsWorking);
    window.addEventListener("offline", () => toggleIsOnline(false));
    window.addEventListener("online", () => toggleIsOnline(true));
  }, []);

  useEffect(() => {
    if (searchedUniversity.toString().length > 0) { 
      getUniversitySubInfrastructure(
        universitiesList, 
        setFacultiesList, 
        "faculties", 
        (newValue: number) => {}, 
        searchedUniversity,
      );
    } 
  }, [searchedUniversity]);

  useEffect(() => {
    if (searchedFaculty.toString().length > 0) {
      getUniversitySubInfrastructure(
        facultiesList,
        setProgrammesList,
        "programmes",
        (newValue: number) => {},
        searchedFaculty,
      );
    }
  }, [searchedFaculty]);

  useEffect(() => {
    if (searchedProgramme.toString().length > 0) {
      getUniversitySubInfrastructure(
        programmesList,
        setCoursesList,
        "courses",
        (newValue: number) => {},
        searchedProgramme,
      );
    }
  }, [searchedProgramme]);
  
  useEffect(() => {
    toggleIsWorking(currentToken.length !== 0);
  }, [currentToken]);

  return (
    <MainContainer className="block-center">
      <LandingSectionWrapper
        className="block-center"
        backgroundSize="initial"
        source={BackgroundPattern}
        backgroundRepeat="repeat"
      >
        <LandingSectionFilter>
          <DocumentUploadFormWrapper className="block-center">
            <DocumentUploadFormHeader className="block-center">
              Tworzenie dokumentu
            </DocumentUploadFormHeader>
            <DocumentUploadFormDataSection className="block-center">
              {
                            isWorking && isOnline ? phaseNumber === 1 ? (
                              <DocumentUploadTextInput
                                type="text"
                                placeholder="Jak nazwiesz ten materia???"
                                value={materialName}
                                onChange={(e) => { setMaterialName(e.target.value); toggleIsOnline(navigator.onLine); }}
                              />
                            ) : phaseNumber === 2 ? (
                              <DocumentUploadDataSubSection className="block-center">
                                <SearchingParametersPicker 
                                  universitiesList={universitiesList}
                                  chosenUniversity={searchedUniversity}
                                  setChosenUniversity={setSearchedUniversity}
                                  facultiesList={facultiesList}
                                  chosenFaculty={searchedFaculty}
                                  setChosenFaculty={setSearchedFaculty}
                                  chosenTypeOfStudies={searchedType}
                                  setChosenTypeOfStudies={setSearchedType}
                                  programmesList={programmesList}
                                  chosenProgramme={searchedProgramme}
                                  setChosenProgramme={setSearchedProgramme}
                                  coursesList={coursesList}
                                  chosenCourse={searchedCourse}
                                  setChosenCourse={setSearchedCourse}
                                  chosenTypeOfSubject={searchedTypeOfSubject}
                                  setChosenTypeOfSubject={setSearchedTypeOfSubject}
                                  chosenSemester={searchedSemester}
                                  setChosenSemester={setSearchedSemester}
                                />
                              </DocumentUploadDataSubSection>
                            ) : phaseNumber === 3 ? isSending 
                              ? <SearchingPreloaderComponent />
                              : (
                                <>
                                  <DocumentUploadDataSubSection className="block-center">
                                    <DocumentUploadFileHeader className="block-center">
                                      {warning.length === 0 ? "Zamie???? materia??" : warning}
                                    </DocumentUploadFileHeader>
                                    <DocumentUploadFileButton
                                      className="block-center" 
                                      onClick={() => FileRef !== undefined && FileRef.current !== null 
                                        ? FileRef.current.click() : null}
                                    >
                                      Wybierz
                                    </DocumentUploadFileButton>
                                    <DocumentUploadFileInput
                                      type="file"
                                      ref={FileRef}
                                      onChange={async (e:any) => selectFile(e, setFile, setWarning, setIsFileLoaded)}
                                    />
                                    <DocumentUploadFileDescription
                                      className="block-center"
                                      onChange={(e:any) => setDesc(e.target.value)}
                                    />
                                  </DocumentUploadDataSubSection>
                                  {
                                    isFileLoaded === 1 && !isSending ? (
                                      <DocumentUploadFileButton
                                        className="block-center"
                                        top={5}
                                        onClick={() => sendFile(
                                          materialName, 
                                          desc, 
                                          searchedUniversity, 
                                          searchedFaculty,
                                          searchedProgramme, 
                                          searchedCourse, 
                                          file,
                                          currentToken, 
                                          setPhaseNumber, 
                                          setDocumentId, 
                                          toggleIsWorking,
                                          toggleIsSending,
                                        )}
                                      >
                                        Wy??lij
                                      </DocumentUploadFileButton>
                                    ) : null
                                }
                                </>
                              ) : (
                                <>
                                  <DocumentUploadNotWorking className="block-center">
                                    Dokument zosta?? opublikowany.
                                  </DocumentUploadNotWorking>
                                  {documentId !== undefined && documentId.length > 0 ? (
                                    <Link to={`/document/${documentId}`}>
                                      <DocumentUploadNotWorking className="block-center">
                                        Link do dokumentu
                                      </DocumentUploadNotWorking>
                                    </Link>
                                  ) : null}
                                </>
                            ) : (
                              <DocumentUploadNotWorking className="block-center">
                                {!isOnline ? "Brak po????czenia z sieci??" : currentToken.length === 0 ? "Zaloguj si??, ??eby wrzuci?? materia??" : "Co?? posz??o nie tak. Spr??buj ponownie"}
                              </DocumentUploadNotWorking>
                            )
                        }
            </DocumentUploadFormDataSection>
            {isOnline ? (
              <DocumentUploadNextButton
                className="block-center"
                scale={(materialName.length > 0 && phaseNumber === 1) || (phaseNumber === 2 
                  && searchedUniversity.toString().length > 0 && searchedFaculty.toString().length > 0
                  && searchedType.length > 0 && searchedProgramme.toString().length > 0
                  && searchedCourse.toString().length > 0 && searchedTypeOfSubject.toString().length > 0) ? 1 : 0}
                onClick={() => setPhaseNumber(phaseNumber + 1)}
              >
                <SwipeRightAltIcon style={{ color: "inherit", fontSize: "inherit" }} />
              </DocumentUploadNextButton>
            ) : null}
          </DocumentUploadFormWrapper>
        </LandingSectionFilter>
      </LandingSectionWrapper>
    </MainContainer>
  );
};

export default DocumentUpload;
