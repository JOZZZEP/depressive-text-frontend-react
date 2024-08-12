import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useState } from "react";

export const ControlledAccordions = (props: any) => {
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange =
    (panel: number) => (_event: any, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      {props.res.map((item: any, index: number) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body1" color={"primary"}>{item.class_name}</Typography>
              <Typography variant="body1" color={"primary"}>{item.amount} {'\u2022'} {item.percent}% </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {item.text.map((text: any, index: number)=>(
            <Box key={index} p={1}>
              <Typography variant="body2">
                {index+1}). {text}
              </Typography>
            </Box>))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
