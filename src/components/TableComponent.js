import { Avatar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  chip: {
    backgroundColor: "#e73f33",
    color: "white",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: 500,
    padding: "3px 12px",
    textTransform: "uppercase",
    transform: "translateY(2px)",
    margin: "0px 10px",
  },
  row: {
    boxShadow: "0px 0px 5px 5px rgb(0,0,0,0.05) ",
    backgroundColor: "white",
    transition: "all 0.2s",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 0px 10px 6px rgb(0,0,0,0.1) ",
      transform: "scale(1.01)",
    },
  },
  cell: {
    border: "0px",
    padding: "10px 0px",
  },
  table: {
    width: "90vw",
    borderSpacing: "0px 8px",
    borderCollapse: "separate",
  },
}));

const TableComponent = ({ data }) => {
  const classes = useStyles();

  console.log(data);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "50px",
        flexDirection: "column",
      }}
    >
      <div>
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>Leaderboard </div>
          <div className={classes.chip}>live</div>
        </h2>
      </div>
      <div style={{ margin: "auto" }}>
        <table className={classes.table}>
          <tbody>
            {data.map((contr, index) => {
              return (
                <tr className={classes.row} key={"rank-" + index}>
                  <td className={classes.cell} width="50px">
                    {index + 1}
                  </td>
                  <td className={classes.cell} width="50px">
                    <Avatar src={contr[1].image} />
                  </td>
                  <td className={classes.cell} align="left">
                    {contr[0]}
                  </td>
                  {contr[1].pr > 0 ? (
                    <td
                      className={classes.cell}
                      width="50px"
                      colSpan={contr[1].issue === 0 ? 2 : 1}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            height="16"
                            viewBox="0 0 16 16"
                            version="1.1"
                            width="16"
                            data-view-component="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
                            ></path>
                          </svg>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            padding: "0px 5px",
                          }}
                        >
                          {contr[1].pr}
                        </div>
                      </div>
                    </td>
                  ) : null}
                  {contr[1].issue > 0 ? (
                    <td
                      className={classes.cell}
                      width="50px"
                      colSpan={contr[1].pr === 0 ? 2 : 1}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            height="15"
                            viewBox="0 0 16 16"
                            version="1.1"
                            width="15"
                            data-view-component="true"
                            style={{ transform: "translate(0px,1px)" }}
                          >
                            <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                            <path
                              fillRule="evenodd"
                              d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                            ></path>
                          </svg>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            padding: "0px 5px",
                          }}
                        >
                          {contr[1].issue}
                        </div>
                      </div>
                    </td>
                  ) : null}
                  <td className={classes.cell} width="200px">
                    <b>{contr[1].score}</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
