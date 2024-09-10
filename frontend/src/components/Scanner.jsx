import { Card, Avatar, Button, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Scanner() {
  const [payload, setPayload] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onScan = () => {
    setLoading(true);
    axios
      .post("http://localhost:8000/prediction", payload)
      .then((res) => {
        if (res.data.category === "") {
          toast.error("Invalid URL. Please put a valid URL");
        } else {
          navigate(`/warning?category=${res.data.category}`);
        }
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
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
        <Button color="warning" onClick={onScan}>
          {loading ? (
            <Spinner color="failure" aria-label="Warning spinner example" />
          ) : (
            <>
              Scan A Url
              <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </Card>
    </center>
  );
}
