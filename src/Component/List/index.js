const List = ({ postItems }) => {
  return (
    <div>
      {postItems.map((item) => {
        const { tweet, id } = item;
        return (
          <>
            <p
              style={{
                width: "500px",
                margin: "auto",
                padding: "20px",
                border: "2px solid black",
                marginTop: "20px",
              }}
              key={id}
            >
              {tweet}
            </p>
          </>
        );
      })}
    </div>
  );
};

export default List;
