
// const { LinkedList, LinkedListNode } = require('@datastructures-js/linked-list');

// const scoreList = new LinkedList();
document.addEventListener('DOMContentLoaded', () => {

    const frameList = [new Frame()];
    rolls = []
    let pointer = 0;
    let final = 0;
    // document.getElementById(`spare${1}`).classList.toggle('focus');

    document.getElementById('roll').addEventListener('click', clickEvent);
    document.getElementById('randomButton').addEventListener('click', clickEvent);

    function clickEvent(e) {
        e.preventDefault();

        let scoreInput = document.getElementById('input-score');

        let alert = document.getElementById('input-alert');
        if (Number(scoreInput.value) > Number(scoreInput.max) || isNaN(scoreInput.value) || Number(scoreInput.value) < 0) {
            alert.classList.add('show');

        } else {
            alert.classList.remove('show');

            const frameNumber = frameList.length;

            //console.log(e.target);
            if (e.target.id == "randomButton") {
                let max = document.getElementById("input-score").getAttribute("max");
                var scoreValue = Math.floor(Math.random() * (Number(max) + 1));
            } else {
                var scoreValue = Number(scoreInput.value.trim());
            }

            console.log(`score is: ${scoreValue}`);
            let currentFrame = frameList.at(-1);
            let documentFrameContainer = document.getElementById(`frame${frameNumber}`); //

            // if not on last frame
            if (frameNumber < 10) {
                // if first roll
                if (currentFrame.score.length == 0) {

                    if (scoreValue < 10) { // if not rolling strike
                        // 1. set contents of frame on html doc to scoreValue
                        // 2. add the score to the current frame object
                        // 3. change maximum allowed score input
                        if (scoreValue == 0) {
                            document.querySelector('.active').classList.toggle('active');
                            document.querySelector('#gutter-image').classList.toggle('active');
                        } else {

                            document.querySelector('.active').classList.toggle('active');
                            document.querySelector('#attack-image').classList.toggle('active');
                        }

                        documentFrameContainer.querySelector('.pre-spare').textContent = scoreValue;
                        scoreInput.setAttribute('max', 10 - scoreValue); //set maxinput value to 10-score
                        if (scoreInput.value > 10 - scoreValue) {
                            scoreInput.value = 10 - scoreValue;
                        }

                    } else { // else its a strike
                        document.querySelector('.active').classList.toggle('active');
                        document.querySelector('#strike-image').classList.toggle('active');


                        documentFrameContainer.querySelector('.spare').textContent = 'X';
                        document.getElementById(`frame${frameNumber}`).classList.toggle('focus');
                        document.getElementById(`frame${frameNumber + 1}`).classList.toggle('focus');

                        currentFrame.isStrike = true;
                        frameList.push(new Frame());


                    }
                    //if second roll
                } else if (currentFrame.score.length == 1) {
                    if (scoreValue + currentFrame.score[0] == 10) { //its a spare

                        documentFrameContainer.querySelector('.spare').textContent = '/';

                        documentFrameContainer.querySelector('.spare').classList.add("show-spare");
                        currentFrame.isSpare = true;

                    } else {

                        documentFrameContainer.querySelector('.spare').textContent = scoreValue;


                    }
                    if (scoreValue == 0) {
                        document.querySelector('.active').classList.toggle('active');
                        document.querySelector('#gutter-image').classList.toggle('active');
                    } else {

                        document.querySelector('.active').classList.toggle('active');
                        document.querySelector('#attack-image').classList.toggle('active');
                    }

                    document.getElementById(`frame${frameNumber}`).classList.toggle('focus');
                    document.getElementById(`frame${frameNumber + 1}`).classList.toggle('focus');

                    scoreInput.setAttribute('max', 10); //reset max value
                    frameList.push(new Frame());
                }

                currentFrame.score.push(scoreValue);
                rolls.push(scoreValue); //keep track of number of rolls
            } else if (!currentFrame.isComplete) { // on the 10th frame
                switch (currentFrame.score.length) {
                    case 0:
                        if (scoreValue == 10) {

                            documentFrameContainer.querySelector('#final-spare-1').textContent = 'X';
                            currentFrame.isStrike = true;
                        } else {

                            documentFrameContainer.querySelector('#final-spare-1').textContent = scoreValue;
                            currentFrame.isStrike = false;
                            scoreInput.setAttribute('max', 10 - scoreValue); //set maxinput value to 10-score
                            if (scoreInput.value > 10 - scoreValue) {
                                scoreInput.value = 10 - scoreValue;
                            }

                        }

                        currentFrame.score.push(scoreValue);
                        break;
                    case 1:
                        if (currentFrame.isStrike) { //first roll was a strike
                            if (scoreValue == 10) {

                                documentFrameContainer.querySelector('#final-spare-2').textContent = 'X'; //another strike?
                                currentFrame.secondStrike = true;

                            } else {
                                documentFrameContainer.querySelector('#final-spare-1').textContent = scoreValue;
                                currentFrame.isStrike = false;
                                scoreInput.setAttribute('max', 10 - scoreValue); //set maxinput value to 10-score
                                if (scoreInput.value > 10 - scoreValue) {
                                    scoreInput.value = 10 - scoreValue;
                                }
                            }
                        } else { // first roll was not a strike
                            if (scoreValue + currentFrame.score[0] == 10) { //this is a spare
                                currentFrame.isSpare == true;
                                documentFrameContainer.querySelector('#final-spare-2').textContent = '/'; //spare
                                scoreInput.setAttribute('max', 10 - scoreValue); //set maxinput value to 10-score
                                if (scoreInput.value > 10 - scoreValue) {
                                    scoreInput.value = 10 - scoreValue;
                                }
                            } else { // final roll

                                documentFrameContainer.querySelector('#final-spare-2').textContent = scoreValue;
                                currentFrame.isComplete = true;
                                currentFrame.score.push(scoreValue);
                                displayFinalScore();
                            }
                        }
                        currentFrame.score.push(scoreValue);
                        break;
                    case 2:
                        documentFrameContainer.querySelector('#final-spare-3').textContent = scoreValue == 10 ? 'X' : scoreValue;
                        currentFrame.isComplete = true;
                        currentFrame.score.push(scoreValue);
                        displayFinalScore();
                        break;
                    default:
                        break;
                }

            }


            displayScore();
            console.log(frameList);


            function displayScore() {
                let total = 0;
                if (pointer > 0) {
                    total = frameList[pointer - 1].accumulate;
                }

                while (pointer < frameNumber - 2) {

                    let current = frameList[pointer]
                    if (current.isStrike) {
                        if (frameList[pointer + 1].isStrike) {
                            current.accumulate = total + 10 + 10 + frameList[pointer + 2].score[0];
                        } else {
                            current.accumulate = total + 10 + frameList[pointer + 1].total();

                        }


                    } else if (current.isSpare) {
                        current.accumulate = total + 10 + frameList[pointer + 1].score[0];
                    } else {
                        current.accumulate = current.total() + total;
                    }
                    console.log("currrent accumulated: " + current.accumulate)
                    document.getElementById(`frame${pointer + 1}`).querySelector(":scope > p").textContent = current.accumulate;

                    pointer += 1;
                    total = current.accumulate;
                }

            }

            function displayFinalScore() {
                let eigth = frameList[7];
                let ninth = frameList[8];
                let tenth = frameList[9];
                if (ninth.isStrike) {
                    ninth.accumulate = eigth.accumulate + 10 + tenth.score[0] + tenth.score[1];

                } else if (ninth.isSpare) {
                    ninth.accumulate = eigth.accumulate + 10 + tenth.score[0];
                } else {
                    ninth.accumulate = eigth.accumulate + ninth.total();
                }

                document.getElementById(`frame9`).querySelector(":scope > p").textContent = ninth.accumulate;

                tenth.accumulate = ninth.accumulate + tenth.total();

                document.getElementById(`frame10`).querySelector(":scope > p").textContent = tenth.accumulate;
            }
        }
    }
    function Frame({ first, second } = {}) {
        this.score = [];
        this.isStrike = false;
        this.isSpare = false;

        this.total = function () {
            return this.score.reduce((sum, val) => sum + val, 0);
        }

    }



});





