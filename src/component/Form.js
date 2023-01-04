import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FormattedMessage } from "react-intl";
import LocalePicker from "./LocalePicker";
import { Spinner } from "./LoadingSpinner";
import "./style.css";

const initialState = {
  title: "",
  name: "",
  questionEnglish: "",
  questionHindi: "",
  questionUrdu: "",
  questionPunjabi: "",
  selectedCategory: "Test",
};
function FormQuestions() {
  const [formData, setFormData] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setStatus("pending");
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.slice(0, 3));
        setStatus("resolved");
      })
      .catch((err) => {
        setStatus("rejected");
        console.log(err);
      });
  }, []);

  const formChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formSubmitHandler = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    //Here you can call the post api
  };

  const categorySelectHandler = (e) => {
    setFormData((prev) => ({ ...prev, selectedCategory: e.target.value }));
  };

  if (status === "pending") {
    return (
      <div className="loading-spinner">
        <Spinner />
      </div>
    );
  }

  return (
    <Form noValidate onSubmit={formSubmitHandler} validated={validated}>
      <LocalePicker />
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={formChangeHandler}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid title.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>
          <FormattedMessage id="name" />
        </Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={formChangeHandler}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid name.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Question English</Form.Label>
        <Form.Control
          as="textarea"
          name="questionEnglish"
          rows={3}
          value={formData.questionEnglish}
          onChange={formChangeHandler}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid english question.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Question Hindi</Form.Label>
        <Form.Control
          as="textarea"
          name="questionHindi"
          rows={3}
          value={formData.questionHindi}
          onChange={formChangeHandler}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid hindi question.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Question Urdu</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="questionUrdu"
          value={formData.questionUrdu}
          onChange={formChangeHandler}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid urdu question.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Question Punjabi</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="questionPunjabi"
          value={formData.questionPunjabi}
          onChange={formChangeHandler}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid punjabi question.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Category</Form.Label>
        <Form.Select
          aria-label="Category"
          onChange={categorySelectHandler}
          value={formData.selectedCategory}
          required
        >
          <option disabled>Select category</option>
          {categories.map((category, id) => (
            <option key={`${id}_${category}`} value={category.title}>
              {category.title}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <div className="d-grid gap-2">
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
}

export { FormQuestions };
