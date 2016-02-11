var _dimension = 10;

if (Meteor.isClient) {
    // This code is executed on the client only

    Meteor.startup(function () {
        // Use Meteor.startup to render the component after the page is ready
        ReactDOM.render(<App />, document.getElementById("render-target"));
    });
}

App = React.createClass({
    getTasks() {
        return [
            { _id: 1, text: "This is task 1" },
            { _id: 2, text: "This is task 2" },
            { _id: 3, text: "This is task 3" }
        ];
    },

    getInitialState() {
        return {
            textAreaValue: "",
            splitIntoCells: false,
            cellValues: []
        };
    },

    renderTasks() {
        return this.getTasks().map((task) => {
            return <Task key={task._id} task={task} />;
        });
    },

    handleChange(event) {
        var _textAreaNewValue = event.target.value;
        var _allLines = _textAreaNewValue.split("\n");
        console.log("all lines: ", _allLines);
        var _cleanLines = [];
        _allLines.forEach(function(line) {
            if (line.length === _dimension) {
                _cleanLines.push(line.split(""));
            }
        })
        console.log(_cleanLines);
        if (_cleanLines.length === 10) {
            this.setState({
                splitIntoCells: true,
                cellValues: _cleanLines
            });
        }
    },

    getRowAndColumnIndices(index) {
        var column = index % _dimension;

        return [(index - column) / _dimension, column];
    },

    calculate() {
        console.log("calculate blob stats here");
        var _totalBooleanAccesses = 1;
        var _cellsNotAccessed = _.range(0,_dimension*_dimension);
        console.log("cells not accessed indices: ", _cellsNotAccessed);


        var _that = this;
        _cellsNotAccessed.forEach(function(cellIndex) {
            console.log(_that.getRowAndColumnIndices(cellIndex));
        });

        var _randomIndex = _.random(0, _dimension*_dimension - 1);
        //find the first one
        var _randomCoord = this.getRowAndColumnIndices(_randomIndex);
        console.log("this.state.cellValues: ", this.state.cellValues);

        var _alreadyCheckedAndTheyAreZero = [];

        while (!this.isCellAtIndexOne(_randomIndex)) {
            _totalBooleanAccesses++;
            _alreadyCheckedAndTheyAreZero.push(_randomIndex);
            _randomIndex = _.random(0, _dimension*_dimension - 1);
            //find the first one
            _randomCoord = this.getRowAndColumnIndices(_randomIndex);
        }
        var _initOneCoord = _randomCoord;
        console.log("total number of boolean accesses to pick the first nonzero cell: ",  _totalBooleanAccesses);
        console.log("initial one coord: ", _randomCoord);



        var _connectedIndicesArr = [_randomIndex];

        var _totalTryFunctionCalls = 0;





        var _indicesAlreadyAccessed = [_randomIndex];
        var _connectedBlobIndicesArr = [_randomIndex];
        var _frontierArr = [];




        var _attemptTwoNumberOfRuns = 0;

        function _attemptTwo(startIndex) {
            console.log("--------------------------------------------------");
            _attemptTwoNumberOfRuns++;


            console.log("inside attempt two");
            console.log("index: ", startIndex);
            console.log("indices already checked: ", _indicesAlreadyAccessed);

            //can check up, below, right, and left if they werent' already checked
            var _indexUp = startIndex - _dimension >= 0 ? startIndex - _dimension : null;
            var _indexDown = startIndex + _dimension <= _dimension*_dimension - 1 ? startIndex + _dimension : null;
            var _indexLeft = startIndex % _dimension >= 1 ? startIndex - 1 : null;
            var _indexRight = startIndex % _dimension <= (_dimension - 2) ? startIndex + 1 : null;

            //check to get rid of those already checked
            var _neighborsToCheck = [];
            if (_indexUp && _.indexOf(_indicesAlreadyAccessed, _indexUp) === -1) {
                _neighborsToCheck.push(_indexUp);
            }

            if (_indexDown && _.indexOf(_indicesAlreadyAccessed, _indexDown) === -1) {
                _neighborsToCheck.push(_indexDown);
            }

            if (_indexLeft && _.indexOf(_indicesAlreadyAccessed, _indexLeft) === -1) {
                _neighborsToCheck.push(_indexLeft);
            }

            if (_indexRight && _.indexOf(_indicesAlreadyAccessed, _indexRight) === -1) {
                _neighborsToCheck.push(_indexRight);
            }

            _frontierArr = [];
            console.log("gonna check these neighbors: ", _neighborsToCheck);

            _neighborsToCheck.forEach(function(neighborIndex) {
                _totalBooleanAccesses++;
                _indicesAlreadyAccessed.push(neighborIndex);


                if (_that.isCellAtIndexOne(neighborIndex)) {
                    _connectedBlobIndicesArr.push(neighborIndex);

                    //check if it's not already in frontier
                    if (_.indexOf(_frontierArr, neighborIndex) === -1) {
                        _frontierArr.push(neighborIndex);
                    }
                }

            });

            console.log("frontier arr is now: ", _frontierArr);

            _frontierArr.forEach(function(frontierIndex) {
                if (_attemptTwoNumberOfRuns <= 1000) {
                    _attemptTwo(frontierIndex);
                    if (_attemptTwoNumberOfRuns === 1000) {
                        console.log("ERRRRRRRR");
                    }
                }
            })
        }





















        function _try(startIndex) {
            console.log("try functionc called with index: ", startIndex);
            console.log("coord: ", _that.getRowAndColumnIndices(startIndex));

            _totalTryFunctionCalls++;
            if (_totalTryFunctionCalls <= 1000 ) {
                //go up, check if not already connected, then connect and call the recusrive function for the cell up
                var _indexUp = startIndex - _dimension;
                var _indexDown = startIndex + _dimension;
                var _indexRight = startIndex + 1;
                var _indexLeft = startIndex - 1;


                if (_indexUp >= 0) {
                    //this means can go up
                    //check to make sure the cell above is NOT among those already checked and zeros
                    if (_.indexOf(_alreadyCheckedAndTheyAreZero, _indexUp) === -1) {
                        _totalBooleanAccesses++;
                        if (_that.isCellAtIndexOne(_indexUp)) {
                            //need to connect these indices
                            _connectedIndicesArr.push(_indexUp);
                            _try(_indexUp);
                        } else {
                            _alreadyCheckedAndTheyAreZero.push(_indexUp);
                            _try(_indexDown);
                            _try(_indexLeft);
                            _try(_indexRight);
                        }
                    }
                } else if (_indexDown <= _dimension*_dimension-1) {
                    if (_.indexOf(_alreadyCheckedAndTheyAreZero, _indexDown) === -1) {
                        _totalBooleanAccesses++;
                        if (_that.isCellAtIndexOne(_indexDown)) {
                            //need to connect these indices
                            _connectedIndicesArr.push(_indexDown);
                            _try(_indexDown);
                        } else {
                            _alreadyCheckedAndTheyAreZero.push(_indexDown);
                            _try(_indexUp);
                            _try(_indexLeft);
                            _try(_indexRight);
                        }
                    }
                } else if ((_indexRight - (_indexRight % _dimension))/_dimension == (startIndex - (startIndex % _dimension))/_dimension) {
                    //the above makes sure we didn't jump to next line
                    if (_.indexOf(_alreadyCheckedAndTheyAreZero, _indexRight) === -1) {
                        _totalBooleanAccesses++;
                        if (_that.isCellAtIndexOne(_indexRight)) {
                            //need to connect these indices
                            _connectedIndicesArr.push(_indexRight);
                            _try(_indexRight);
                        } else {
                            _alreadyCheckedAndTheyAreZero.push(_indexRight);
                            _try(_indexDown);
                            _try(_indexLeft);
                            _try(_indexUp);
                        }
                    }
                } else if ((_indexLeft - (_indexLeft % _dimension))/_dimension == (startIndex - (startIndex % _dimension))/_dimension) {
                    //the above makes sure we didn't jump to next line
                    if (_.indexOf(_alreadyCheckedAndTheyAreZero, _indexLeft) === -1) {
                        _totalBooleanAccesses++;
                        if (_that.isCellAtIndexOne(_indexLeft)) {
                            //need to connect these indices
                            _connectedIndicesArr.push(_indexLeft);
                            _try(_indexLeft);
                        } else {
                            _alreadyCheckedAndTheyAreZero.push(_indexLeft);
                            _try(_indexDown);
                            _try(_indexUp);
                            _try(_indexRight);
                        }
                    }
                }

                //go down

                //go left

                //go right
            } else {
                console.log("STAHP");
            }


        }


        //_try(_randomIndex);
        _attemptTwo(_randomIndex);
        console.log("ANSWER: ", _connectedBlobIndicesArr);
        console.log("total bool accesses: ", _totalBooleanAccesses);
        console.log("indices checked: ", _indicesAlreadyAccessed.length);
        console.log("indices chedked uniq: ", _.uniq(_indicesAlreadyAccessed).length);
        _.uniq(_indicesAlreadyAccessed).forEach(function(index) {
            var _coord = _that.getRowAndColumnIndices(index);
            var _id = _coord[0] + "_" + _coord[1];
            var _selector = $("#" + _id);
            _selector.removeClass("btn-default").addClass("btn-info");
            console.log("element: ", _selector.html());
        })
        console.log("--------------------");








        console.log("connected indices arr: ", _connectedIndicesArr);

    },

    isCellAtIndexOne(index) {
        var _rowAndCol = this.getRowAndColumnIndices(index);
        return this.state.cellValues[_rowAndCol[0]][_rowAndCol[1]] == 1;
    },

    clearCells() {
        this.setState({
            splitIntoCells: false,
            cellValues: []
        });

    },

    nothing(event) {
    },

    renderCells() {
        return (
            <div>
                {this.state.cellValues.map((cellValues, y) => {
                    return (<div className="row" key={y}>{cellValues.map((cell, x) => {
                        let _key = y + "_" + x;
                        let _class = "btn btn-default" + ((cell === "1") ? " active" : "");

                        return <button className={_class} id={_key} key={_key} onClick={this.nothing}>{cell}</button>;
                    })}<br/></div>)
                })}
            </div>
        );
    },

    render() {
        return (
            <div className="container">
                <header>
                    <h1>welcome to the blob app</h1>
                </header>

                <h4>enter blob matrix below:</h4>
                {!this.state.splitIntoCells ?
                    <div className="textAreaEntryDiv">
                            <textarea rows="20" cols="50"
                                      value={this.state.textAreaValue}
                                      onChange={this.handleChange}></textarea>
                    </div> :
                    <div>
                        {this.renderCells()}
                        <br/>
                        <button className="btn btn-default" onClick={this.calculate}>calculate blob</button>
                        <br/>
                        <button className="btn btn-default" onClick={this.clearCells}>clear</button>
                    </div>
                }

            </div>
        );
    }
});