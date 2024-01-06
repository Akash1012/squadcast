const List = ({ postItems }) => {
  return (
    <div
      style={{
        width: "500px",
        margin: "auto",
        padding: "20px",
        border: "2px solid black",
      }}
    >
      {postItems.map((item) => {
        const { tweet, id } = item;
        return (
          <>
            <p key={id}>{tweet}</p>
          </>
        );
      })}
    </div>
  );
};

export default List;
