import { useEffect, useState, useRef, useCallback } from "react";
import "./style.css";
import List from "../List";

let savePreviousText = [];
function Post() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const autocompleteRef = useRef();
  const selectRef = useRef(null);
  const [saveallPost, setSaveAllPost] = useState([]);
  const [loader, setLoader] = useState({
    loading: false,
    total: 0,
  });

  useEffect(() => {
    const closeList = (event) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("click", closeList);
    return () => document.removeEventListener("click", closeList);
  }, []);

  const getTheData = (search = "") => {
    setLoader({
      ...loader,
      loading: true,
    });
    fetch(`https://dummyjson.com/user/search?q=${search}`)
      .then((res) => res.json())
      .then((items) => {
        setLoader({
          total: items.total,
          loading: false,
        });
        setData(items.users);
      });
  };

  const handleClick = (title) => {
    let splitTheValue = value.split(" ");
    splitTheValue[splitTheValue.length - 1] = "@" + title;
    setValue(splitTheValue.join(" "));
    setShow(false);
  };

  function inputDebounce(fn) {
    let timer;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      setValue(args[0].target.value);
      timer = setTimeout(() => {
        fn(...args);
      }, 50);
    };
  }

  const [storePreviousValue, setStorePreviousValue] = useState([]);

  function handleInputChange(event) {
    let getTheInputText = event.target.value;
    const checkEnter = getTheInputText.split("");
    if (checkEnter[checkEnter.length - 1] !== "\n") {
      setStorePreviousValue(getTheInputText);
    }
  }

  useEffect(() => {
    if (storePreviousValue?.length > 0) {
      const letSplit = storePreviousValue?.split("");

      let compareCurrentPreviousValue = storePreviousValue
        ?.split(" ")
        .filter((item) => !savePreviousText.includes(item));
      savePreviousText = storePreviousValue?.split(" ");
      let joinTheText = compareCurrentPreviousValue.join("");
      let findTheIndexOfTag = joinTheText.indexOf("@");

      if (findTheIndexOfTag !== -1 && letSplit[letSplit.length - 1] !== " ") {
        getTheData(joinTheText.slice(1));
        setShow(true);
        return;
      } else {
        setShow(false);
      }
    }
    if (storePreviousValue.length === 0) {
      setShow(false);
      setStorePreviousValue("");
      savePreviousText = "";
    }

    return;
  }, [storePreviousValue]);

  const optimisedCall = useCallback(inputDebounce(handleInputChange), []);

  const handleKeyUp = (event) => {
    const keyCode = event.keyCode;
    setChange();
    if (keyCode === 13) {
      if (data[activeIndex]?.firstName) {
        handleClick(data[activeIndex].firstName);
        setData([]);
        setActiveIndex(null);
        setShow(false);
        return;
      }
    }

    if (keyCode === 40) {
      // key move down
      if (activeIndex === null || activeIndex === data.length - 1) {
        setActiveIndex(0);
        return;
      }
      setActiveIndex((prevIndex) => prevIndex + 1);
    } else if (keyCode === 38) {
      // move up
      if (activeIndex === 0) setActiveIndex(data.length - 1);
      else setActiveIndex((prevIndex) => prevIndex - 1);
    }
  };

  const setChange = () => {
    const selected = selectRef?.current?.querySelector(".active");
    if (selected) {
      selected?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const savePost = () => {
    setSaveAllPost([
      ...saveallPost,
      {
        id: new Date().getTime(),
        tweet: value,
      },
    ]);
    setValue("");
    setShow(false);
  };

  // function highlight(text) {
  //   var inputText = document.getElementById("inputText");
  //   var innerHTML = inputText.innerHTML;
  //   var index = innerHTML.indexOf(text);
  //   if (index >= 0) {
  //     innerHTML =
  //       innerHTML.substring(0, index) +
  //       "<span className='highlight'>" +
  //       innerHTML.substring(index, index + text.length) +
  //       "</span>" +
  //       innerHTML.substring(index + text.length);
  //     var dateSpan = document.createElement("span");

  //     dateSpan.innerHTML = inputText.value;
  //     inputText.appendChild(dateSpan);
  //   }
  // }

  return (
    <>
      <h3 className="header">
        What's is happening (NOTE: NO USE OF 3RD PARTY PACKAGE)
      </h3>
      <h4
        style={{
          color: "red",
          textAlign: "center",
        }}
      >
        (NOTE: NO USE OF 3RD PARTY PACKAGE)
      </h4>
      <div className="autocomplete" ref={autocompleteRef}>
        <textarea
          id="inputText"
          rows="5"
          cols="60"
          value={value}
          type="text"
          onChange={(e) => optimisedCall(e)}
          placeholder="Mention"
          onKeyUp={handleKeyUp}
        />

        {show && (
          <ul ref={selectRef}>
            {data.map((item, index) => {
              return (
                <li
                  className={index === activeIndex && "active"}
                  onClick={() => handleClick(item.firstName)}
                >
                  {item.firstName}
                </li>
              );
            })}

            {(loader.loading || loader.total === 0) && (
              <h2 style={{ textAlign: "center" }}>
                {loader.loading
                  ? "Loading .."
                  : loader.total === 0 && "NO DATA"}
              </h2>
            )}
          </ul>
        )}
        <div className="btn_post" onClick={savePost}>
          <button>Post</button>
        </div>
      </div>
      {saveallPost.length > 0 && <List postItems={saveallPost} />}
    </>
  );
}

export default Post;
