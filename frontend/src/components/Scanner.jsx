import { Card, Avatar, Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Scanner() {
  const [payload, setPayload] = useState();
  const navigate = useNavigate();

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };
  return (
    <center style={{ marginTop: "100px" }}>
      <Card className="max-w-xl">
        <Avatar img="/Lion2.jpg" rounded size="xl" />
        <h1 className="text-center text-xl mb-4 mt-3">KRAVEN THE HUNTER</h1>
        <span className="text-center text-sm text-xl">
          <b>Scanner</b>
          <br />
        </span>
        <span className="text-center text-sm mb-4">
          Scan any URL by pasting it into the field below.
        </span>
        <form className="flex flex-col gap-4">
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
        </form>
        <Button color="warning" onClick={() => navigate("/scan")}>
          Scan A URL
          <HiOutlineArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Card>
    </center>
  );
}
