<template>
  <div>drtyftughioijkpl</div>
</template>

<script>
import { addQuestion } from "@/api/question/index.js";
export default {
    created(){
        addQuestion(
            {
                nas:[{naireId:1,questionId:2,userAnswer:'a'},{naireId:1,questionId:2,userAnswer:'a'}]
            }
        ).then(res=>{
            console.log(res)
        })
    }

};
</script>

<style lang="scss" scoped>
</style>