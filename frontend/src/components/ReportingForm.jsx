import {
  Button,
  Card,
  TextInput,
  Avatar,
  Spinner,
  Select,
} from "flowbite-react";
import { useState } from "react";

export default function ReportingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState();
  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    setIsLoading(true);
    console.log(payload);
  };
  return (
    <center style={{ marginTop: "150px" }}>
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
          <Button color="warning" onClick={onSubmit}>
            {isLoading ? (
              <Spinner color="warning" aria-label="Warning spinner example" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Card>
    </center>
  );
}
