import {
  Button,
  Card,
  TextInput,
  Avatar,
  Spinner,
  Select,
} from "flowbite-react";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ReportingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState();
  const navigate = useNavigate();

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    setIsLoading(true);
    axios
      .post("http://localhost:8000/reports", payload)
      .then((res) => {
        toast.success(
          "Your report has been  submitted. Thank you for making the web a better place!"
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        console.log(res);
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  return (
    <center style={{ marginTop: "100px" }}>
      <Card className="max-w-xl">
        <Avatar img="/Lion2.jpg" rounded size="xl" />
        <h1 className="text-center text-xl mb-4 mt-3">KRAVEN THE HUNTER</h1>
        <span className="text-center text-sm mb-4">
          <b>
            Report a malicious site and help other stear clear of the dangers of
            the internet.
          </b>
          <br />
          <br />
          Enter your email so that we inform you on the progress of your report
          as well as the URL for the site you are reporting
        </span>
        <form className="flex flex-col gap-4">
          <div>
            <TextInput
              id="email"
              placeholder="Email"
              required
              type="email"
              onChange={onChange}
              name="email"
            />
          </div>
          <div>
            <TextInput
              id="url"
              placeholder="URL"
              required
              type="text"
              onChange={onChange}
              name="url"
            />
          </div>
          <div className="max-w-xl">
            <Select
              id="threat_category"
              required
              onChange={onChange}
              name="threat_category"
            >
              <option>-- Select Threat Category --</option>
              <option>Phishing</option>
              <option>Typo Squating</option>
            </Select>
          </div>
          <Button color="failure" onClick={onSubmit}>
            {isLoading ? (
              <Spinner color="failure" aria-label="Warning spinner example" />
            ) : (
              "Submit"
            )}
          </Button>
          <Button color="warning" onClick={() => navigate("/scan")}>
            Scan A URL
            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </Card>
    </center>
  );
}
