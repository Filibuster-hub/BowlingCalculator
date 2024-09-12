function getScore() {
        let currentRoll = 0;
        let totalScore = globalTotalScore;
        let currentFrame = pointer;
        let canCalculate = true;

        while(currentFrame < frameList.length-1 && canCalculate){
            if (frameList[currentFrame].isStrike){
                if (canCalculateStrike(currentRoll)){
                    totalScore+=10 + rolls[currentRoll+1] + rolls[currentRoll+2];

                }else{
                    pointer = currentFrame;
                    canCalculate=false;
                }
            }else if (frameList[currentFrame].isSpare){
                if (canCalculateSpare(currentRoll)){
                    totalScore+= rolls[currentRoll+1]+10;
                }else{
                    canCalculate = false;
                }
            }else if(frameList[currentFrame].score.length==2){
                if(canCalculateOpen(rollIndex)){
                    totalScore+= frameList[currentFrame].score[0]+frameList[currentFrame].score[1];
                }
            }
        }


        function canCalculateStrike(rollIndex) {
            return rollIndex + 2 < rolls;
        }

        function canCalculateSpare(rollIndex) {
            return rollIndex + 1 < rolls;
        }
        function canCalculateOpen(rollIndex) {
            return rollIndex + 1 < rolls;
        }
    }
