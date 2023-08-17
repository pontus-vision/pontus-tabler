import ListGroup from "react-bootstrap/ListGroup";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getContentModel, listModel } from "../client";
import { useDispatch } from "react-redux";
import { setModel } from "../store/slice";
import { Link } from "react-router-dom";

const ListItems = ({ header, arr }: ListItemsProp) => {
  const [showList, setShowList] = useState(false);

  const dispatch = useDispatch();

  const toggleList = () => {
    setShowList(!showList);
  };

  const selectModelId = (model: Object) => {
    // const modelFormatted = model[model.length -1] !== "s" ? model + "s" : model
    // console.log(model)

    dispatch(setModel(model));
  };

  return (
    <ListItemsStyles>
      <label onClick={toggleList} className={`${showList ? "active" : ""}`}>
        {header}
      </label>
      <ListGroup className={`group ${showList ? "active" : ""}`}>
        {!!arr &&
          arr.map((item, index) => (
            <ListGroup.Item
              key={index}
              onClick={() => selectModelId(item)}
              className={`group__item ${showList ? "active" : ""}`}
            >
              <Link to={`/model/${item.modelId}`}>{item.name}</Link>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </ListItemsStyles>
  );
};

const ListItemsStyles = styled.div`
  /* & .active { */
  /*   background-color: blue; */
  /*   color: white; */
  /* } */
  & .group {
    /* transform: translateX(-100%);  */
    position: relative;
    /* position: absolute */
    /* display: none; */
    overflow: hidden;
    left: -30rem;
    height: 0;
    transition: height 200ms ease-in-out, left 200ms ease-in-out,
      transform 200ms ease-in-out;
    &.active {
      /* height: fit-content; */
      height: 100%;
      position: relative;
      left: 0rem;
      display: block;
      /* transform: translateX(0%); */
    }
    &__item {
      /* position: absolute; */
      &:hover {
        background-color: blue;
        color: white;
      }
    }
  }
  text-align: center;
`;

type ListItemsProp = {
  header?: string;
  arr: any[];
};

export default ListItems;
