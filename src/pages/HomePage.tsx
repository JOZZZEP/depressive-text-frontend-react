import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Divider, TextField, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import { Box, Container } from "@mui/system";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { ControlledAccordions } from "../components/Accordion";
import { Loading } from "../components/Loading";

function HomePage() {
  const api_endpoint ="https://depressive-text-api-ol46lfdmbq-de.a.run.app";
  
  const [currentTab, setCurrentTab] = useState("text");
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);

  const [selectedButtonId, setSelectedButtonId] = useState(0);
  const algorButtons = [
    { label: "LSTM", acc: "81%", id: 0 },
    { label: "CNN", acc: "81%", id: 1 },
  ];

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setResponse(null);
    if (currentTab === "text") {
      if (text != "") {
        setLoading(true);
        getPredict(text)
          .then((res) => {
            setResponse(res.response);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      if (csvFile != null) {
        setLoading(true);
        getPredictCSV(csvFile)
          .then((res) => {
            setResponse(res.response);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  async function getPredict(text: string) {
    const body = {
      text: text,
    };
    let url;
    if (selectedButtonId === 0) {
      url = api_endpoint+"/lstm-predict";
    } else {
      url = api_endpoint+"/cnn-predict";
    }
    const response = await axios.post(url, body);
    const res = response.data;
    return res;
  }

  async function getPredictCSV(file: File) {
    let url;
    if (selectedButtonId === 0) {
      url = api_endpoint+"/lstm-predict-csv";
    } else {
      url = api_endpoint+"/cnn-predict-csv";
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const res = response.data;
    return res;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      setCsvFile(file);
    }
  }

  const resetFileInput = () => {
    const fileInput = document.getElementById("upload-csv") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleTabChange = (_e: any, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth={"lg"}>
      <Box pt={3} pb={3}>
        <Typography
          color={"primary"}
          fontWeight={"light"}
          fontSize={{ md: 65, sm: 55, xs: 40 }}
        >
          DEPRESSIVE
        </Typography>
        <Typography
          color={"primary"}
          fontWeight={"light"}
          fontSize={{ md: 40, sm: 30, xs: 20 }}
        >
          CLASSIFICATION
        </Typography>
        <Box display={"flex"} flexWrap={"wrap"} gap={5} pt={2} pb={2}>
          <Box flex={1} flexBasis={"400px"}>
            <Box bgcolor={"secondary.main"} mb={3}>
              <TabContext value={currentTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleTabChange}>
                    <Tab label="Text" value="text" />
                    <Tab label="Upload (.csv)" value="csv" />
                  </TabList>
                </Box>
                <TabPanel value="text">
                  <TextField
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Enter Text"
                    multiline
                    minRows={4}
                    maxRows={6}
                    fullWidth
                    sx={{
                      bgcolor: "white",
                      "& .MuiInputBase-root": {
                        "& textarea": {
                          "&::-webkit-scrollbar": {
                            width: "8px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f1f1f1",
                            borderRadius: "10px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#888",
                            borderRadius: "10px",
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            background: "#555",
                          },
                        },
                      },
                    }}
                  />
                </TabPanel>
                <TabPanel value="csv">
                  {csvFile ? (
                    <Box
                      pb={1}
                      sx={{
                        display: "table",
                        tableLayout: "fixed",
                        width: "100%",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box display={"flex"} gap={1} alignItems={"center"}>
                        <InsertDriveFileIcon color="primary" fontSize="large" />
                        <Typography
                          color={"primary"}
                          fontWeight={"regular"}
                          variant="h6"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {csvFile.name}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box mb={2} p={2} bgcolor={"white"} borderRadius={2}>
                      <Typography
                      mb={1}
                        color={"primary.dark"}
                        fontWeight={"regular"}
                        variant="body1"
                      >
                        CSV example
                      </Typography>

                      <Divider />
                      <Box mt={1}>
                        <img
                          src="/csv-example.png"
                          style={{ maxWidth: "100%" }}
                        />
                      </Box>
                    </Box>
                  )}
                  <Button
                    disabled={loading}
                    component="label"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => {
                      resetFileInput();
                    }}
                  >
                    Upload File (.csv)
                    <input
                      accept=".csv"
                      style={{ display: "none" }}
                      id="upload-csv"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                </TabPanel>
              </TabContext>
            </Box>
            <Box bgcolor={"secondary.main"} p={2} mb={3}>
              <Typography color={"primary"} fontWeight={"regular"} variant="h6">
                Choose Algorithm :{" "}
                <Box component="span" fontWeight="bold">
                  {algorButtons[selectedButtonId].label}{" "}
                  {algorButtons[selectedButtonId].acc}
                </Box>
              </Typography>
              <Box display={"flex"} gap={2} mt={2}>
                {algorButtons.map((button) => (
                  <Button
                    key={button.id}
                    disabled={loading}
                    fullWidth
                    size="large"
                    variant="contained"
                    color={
                      selectedButtonId === button.id ? "primary" : "secondary"
                    }
                    onClick={() => setSelectedButtonId(button.id)}
                  >
                    {button.label}
                  </Button>
                ))}
              </Box>
            </Box>
            <Button
              disabled={loading}
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSubmit}
            >
              Analysis
            </Button>
          </Box>
          <Box
            flex={1}
            flexBasis={"400px"}
            bgcolor={"secondary.main"}
            minHeight={250}
            maxHeight={450}
            display={"flex"}
            flexDirection={"column"}
          >
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              minHeight={48}
              bgcolor={"secondary.dark"}
            >
              <Typography color={"white"} fontWeight={"regular"} variant="h6">
                RESULT
              </Typography>
            </Box>

            {response && response.result && (
              <Box
                pl={3}
                pr={5}
                pt={2}
                pb={1}
                sx={{
                  display: "table",
                  tableLayout: "fixed",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    color={"primary"}
                    fontWeight={"regular"}
                    variant="body1"
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {response.fileName}
                  </Typography>
                  <Typography
                    color={"primary.dark"}
                    fontWeight={"regular"}
                    variant="h6"
                  >
                    {response.totalRow}
                  </Typography>
                </Box>
              </Box>
            )}
            <Box
              position={"relative"}
              height={"100%"}
              overflow={"auto"}
              ml={3}
              mr={3}
              mb={3}
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              {loading && <Loading />}
              {response && response.text ? (
                <Box mt={3} p={2} bgcolor={"white"} borderRadius={2}>
                  <Typography variant="body2" mb={2}>
                    {response.text}
                  </Typography>
                  <Divider />
                  <Typography
                    mt={1}
                    color={response.text ? "primary.dark" : "secondary.dark"}
                    fontWeight={"bolder"}
                    variant="h6"
                  >
                    {response.className}
                  </Typography>
                </Box>
              ) : response && response.result ? (
                <Box>
                  <ControlledAccordions res={response.result} />
                </Box>
              ) : !loading ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    mt={2}
                    color={"secondary.dark"}
                    fontWeight={"regular"}
                    variant="h6"
                  >
                    NO RESULT
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
