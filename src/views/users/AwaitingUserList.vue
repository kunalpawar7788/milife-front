<template>
<FilteredUserList :invited="null" :email_verified="false"></FilteredUserList>
</template>

<script>
import FilteredUserList from "@/components/FilteredUserList";
export default {
    name: "AwaitingUserList",
    components: {FilteredUserList,},
    
}
</script>


