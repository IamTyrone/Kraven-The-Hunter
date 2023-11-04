import { Card, Avatar } from "flowbite-react";

export default function Warning() {
  return (
    <center style={{ marginTop: "200px" }}>
      <Card className="max-w-xl">
        <Avatar img="/Lion2.jpg" rounded size="xl" />
        <h1 className="text-center text-xl mb-4 mt-3">KRAVEN THE HUNTER</h1>
        <span className="text-center text-sm mb-2 text-xl text-orange-700">
          <b>! Warning !</b>
          <br />
          <br />
        </span>
        <span className="text-center text-sm mb-4">
          The website that you intend on visiting has been flagged as malicious.
          The following below are our classifications for its threat level and
          why it was flagged.
        </span>
      </Card>
    </center>
  );
}
