import { Card, Avatar, Banner, Badge, Button } from "flowbite-react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Warning() {
  const navigate = useNavigate();
  return (
    <center style={{ marginTop: "100px" }}>
      <Card className="max-w-xl">
        <Avatar img="/Lion2.jpg" rounded size="xl" />
        <h1 className="text-center text-xl mb-4 mt-3">KRAVEN THE HUNTER</h1>
        <span className="text-center text-sm text-xl text-orange-700">
          <b>! Warning !</b>
          <br />
          <br />
        </span>
        <span className="text-center text-sm mb-4">
          The website that you intend on visiting has been flagged as malicious.
          The following below are our classifications for its threat level and
          why it was flagged.
        </span>
        <Banner>
          <div className="flex w-[calc(100%-2rem)] flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row lg:max-w-7xl">
            <div className="mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center">
              <p className="mb-2 flex items-center border-gray-200 dark:border-gray-600 md:mb-0 md:mr-4 md:border-r md:pr-4">
                <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white md:pr-6">
                  CATEGORY
                </span>
              </p>
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                Spear Phishing
              </p>
            </div>
          </div>
        </Banner>
        <Banner>
          <div className="flex w-[calc(100%-2rem)] flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row lg:max-w-7xl">
            <div className="mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center">
              <p className="mb-2 flex items-center border-gray-200 dark:border-gray-600 md:mb-0 md:mr-4 md:border-r md:pr-4">
                <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white md:pr-6">
                  SEVERITY
                </span>
              </p>
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <Badge color="failure" size="xl" className="m-1">
                  Ultra
                </Badge>
                <Badge color="warning" size="xl" className="m-1">
                  High
                </Badge>
                <Badge color="dark" size="xl" className="m-1">
                  Medium
                </Badge>
              </p>
            </div>
          </div>
        </Banner>
        <Banner>
          <div className="flex w-[calc(100%-2rem)] flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row lg:max-w-7xl">
            <div className="mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center">
              <p className="mb-2 flex items-center border-gray-200 dark:border-gray-600 md:mb-0 md:mr-4 md:border-r md:pr-4">
                <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white md:pr-6">
                  CONFIDENCE
                </span>
              </p>
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <Badge color="failure" size="xl" className="m-1">
                  100%
                </Badge>
              </p>
            </div>
          </div>
        </Banner>
        <Button color="warning" onClick={() => navigate("/scan")}>
          Scan A URL
          <HiOutlineArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button color="failure" onClick={() => navigate("/")}>
          Report A URL
          <HiOutlineArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Card>
    </center>
  );
}
