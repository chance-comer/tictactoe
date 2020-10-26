import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//class Square extends React.Component {
//  render() {
//      return (
//          <button className="square"
//              onClick={() => { this.props.onClick(); }}>
//              {this.props.value}
//      </button>
//    );
//  }
//}

function Square(props) {
    const highlight = props.highlight ? " highlight" : "";
    return (        
        <button className={"square" + highlight }  onClick = { props.onClick } >
              { props.value }
      </button>
    );
}

class Board extends React.Component {
    //constructor(props) {
    //    super(props);

    //    this.state = {
    //        squares: Array(9).fill(null),
    //        isNextCross : true
    //    }
    //}

    renderSquare(i) {
        return (<Square
            highlight={this.props.highlight.includes(i)}
            value={this.props.squares[i]}
            onClick={() => { this.props.onClick(i); }}
        />);
        //return Square({
        //    value: this.state.squares[i],
        //    onClick: () => { this.handleClick(i); } 
        //});

    }

    render() {

        let board = [];
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = 0; j < 3; j++) {
                row.push(<span key={j}>{this.renderSquare(j + 3 * i)}</span>);
            }
            board.push(<div className="board-row" key={i}>{row}</div>)
        }
        return (

        <div>{ board }</div>
      //<div>
      //  <div className="board-row">
      //    {this.renderSquare(0)}
      //    {this.renderSquare(1)}
      //    {this.renderSquare(2)}
      //  </div>
      //  <div className="board-row">
      //    {this.renderSquare(3)}
      //    {this.renderSquare(4)}
      //    {this.renderSquare(5)}
      //  </div>
      //  <div className="board-row">
      //    {this.renderSquare(6)}
      //    {this.renderSquare(7)}
      //    {this.renderSquare(8)}
      //  </div>
      //</div>
    );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{ squares: new Array(9).fill(null), clickedSquare: null }],
            isNextCross: true,
            stepNumber: 0,
            isStepAsc: true
        }

    }

    jumpTo(step) {
        const selected = document.querySelector(".game-info ol li.selected");
        if (selected) selected.className = '';
        document.querySelectorAll(".game-info ol li")[step].className = "selected"
        this.setState({
            stepNumber: step,
            isNextCross: (step%2) == 0
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let squares = current.squares.slice();
        let winLine = { line: [] };

        if (calculateWinner(squares, winLine) || squares[i]) {
            return;
        }
        console.log(squares.filter(n => n));
        if (squares.filter(n => n).length === 9) {
            alert('game over, there is no winner');
        }
        squares[i] = this.state.isNextCross ? 'X' : 'O';
        this.setState({
            history: history.concat([{ squares: squares, clickedSquare: i }]),
            isNextCross: !this.state.isNextCross,
            stepNumber: history.length
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber/*history.length - 1*/];
        let winLine = { line: [] };
        const winner = calculateWinner(current.squares, winLine);
        console.log(winLine);
        let status;
        if (winner) {
            status = 'Winner ' + winner;
        } else {
            status = 'Next player: ' + (this.state.isNextCross ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            const description = move ? 'Return to step #' + move + ' (row: ' + (Math.floor(step.clickedSquare / 3) + 1) + ' col: ' + (step.clickedSquare % 3 + 1) + ')' : 'Return to start';
            return (
                <li key={move}>
                    <button onClick={
                        () => {
                            this.jumpTo(move);
                        }
                    }>{description}</button>
                </li>
            );
        });

        if (!this.state.isStepAsc) moves.sort(function (a, b) {
            return b.key - a.key;
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board highlight={winLine.line} squares={current.squares} onClick={(i) => { this.handleClick(i); }} />
                </div>
                <div className="game-info">
                    <button onClick={() => {
                        this.setState({
                            isStepAsc: !this.state.isStepAsc
                        });
                    }}>Sort moves</button>
                    <div>{status}</div>
                    <ol>{moves/*this.state.isStepAsc ? moves : moves.reverse()*/}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares, winLine) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winLine.line = lines[i];
            return squares[a];
        }
    }
    return null;
}