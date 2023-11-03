import { Button, Card, TextInput, Avatar } from "flowbite-react";

export default function ReportingForm() {
  return (
    <center style={{ marginTop: "250px" }}>
      <Card className="max-w-xl">
        <Avatar img="/kravenLogo.avif" rounded size="xl" />
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
            <TextInput id="email" placeholder="Email" required type="email" />
          </div>
          <div>
            <TextInput id="url" placeholder="URL" required type="text" />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </center>
  );
}
