<template>
<FilteredUserList :invited="null" :email_verified="true"></FilteredUserList>
</template>

<script>
import FilteredUserList from "@/components/FilteredUserList";
export default {
    name: "ActiveUserList",
    components: {FilteredUserList,},
    
}
</script>