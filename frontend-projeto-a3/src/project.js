import Chart from 'chart.js/auto';

const ctx = document.getElementById("myChart").getContext()

const chart = new Chart(ctx, {
    type:"bar",
    data:{
        datasets:[
            {
                label:"teste", data:[1, 3, 4 ,7, 9, 10, 20, 40]
            }
        ]
    }
})