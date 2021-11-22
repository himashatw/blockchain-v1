import { Form, Input, Button, Row, Col, notification } from "antd";
import "antd/lib/form/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/button/style/index.css";
import "antd/dist/antd.css";
import { useEffect, useState } from "react";
import axios from "axios";

function FormComponent() {
  const [ideas, setIdeas] = useState([]);
  const [trigger, SetTrigger] = useState(false);

  const getIdeas = async () => {
    await axios
      .get("http://localhost:8080/ideas")
      .then((response) => {
        setIdeas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getIdeas();
  }, [trigger]);

  const onFinish = async (values) => {
    await axios
      .get(`http://localhost:8080/proveIt/${values.idea}`)
      .then((response) => {
        SetTrigger(!trigger);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onClickHandler = async (mIdea) => {
    await axios
      .get(`http://localhost:8080/ideaProof/${mIdea}`)
      .then((response) => {
        if (
          response.data.proofs &&
          response.data.proofs[0] &&
          response.data.proofs[0].status
        ) {
          notification.open({
            message: "Idea Proof",
            description: `Proof Status: ${response.data.proofs[0].status} & Stored in : ${response.data.proofs[0].collection}`,
            placement: "bottomLeft",
          });
        } else {
          notification.open({
            message: "Failed to get Proof.",
            description: "Could not get the proof for this idea!",
            placement: "bottomLeft",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Row gutter={32}>
      <Col span={12}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Idea"
            name="idea"
            rules={[
              {
                required: true,
                message: "Please input your idea!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
        {ideas.map((idea, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#b7bdc7",
              borderRadius: 5,
              padding: 10,
              marginBottom: 5,
            }}
            onClick={() => onClickHandler(idea.idea)}
          >
            <p>
              {idea.idea} <br />{" "}
              <span>{String(new Date(idea.uploadDate))}</span>
            </p>
            Click to view details
          </div>
        ))}
      </Col>
    </Row>
  );
}

export default FormComponent;
