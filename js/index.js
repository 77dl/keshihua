// 模拟各省份城市的气温数据
const provinceCityData = {
    "北京": [
        { name: "东城区", value: 20 },
        { name: "西城区", value: 21 },
        { name: "朝阳区", value: 19 },
        // 其他区的数据...
    ],
    "天津": [
        { name: "和平区", value: 18 },
        { name: "河东区", value: 17 },
        { name: "河西区", value: 19 },
        
    ],
    "河北": [
      { name: "石家庄市", value: 21},
      { name: "唐山市", value: 22 },
      { name: "秦皇岛市", value: 19 },
      { name: "邯郸市", value: 22 },
      { name: "邢台市", value: 17 }
    ],
    "江苏": [
      { name: "南京市", value: 21 },
      { name: "苏州市", value: 18 },
      { name: "无锡市", value: 19 },
      { name: "常州市", value: 18 },
      { name: "徐州市", value: 21 }
    ],
    "广东": [
      { name: "广州市", value: 22 },
      { name: "深圳市", value: 20 },
      { name: "佛山市", value: 21 },
      { name: "东莞市", value: 19 },
      { name: "中山市", value: 17 }
    ],
    "四川": [
      { name: "成都市", value:  19},
      { name: "德阳市", value: 20 },
      { name: "南充市", value: 21 },
      { name: "宜宾市", value:  22}
    ],
    "黑龙江": [
      { name: "哈尔滨市", value:  21},
      { name: "齐齐哈尔市", value: 20 },
      { name: "牡丹江市", value: 21 },
      { name: "佳木斯市", value:  22},
      { name: "大庆市", value:  29}
    ]
  };
  
  // 柱状图模块：各地区平均气温
  (function () {
    const chartDom = document.querySelector(".bar .chart");
    const myChart = echarts.init(chartDom);
    const provinces = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "香港", "澳门", "台湾"];
  
    const baseOption = {
        tooltip: {
            trigger: 'axis',
            formatter: params => `${params[0].name}<br/>平均气温: ${params[0].value}℃`
        },
        grid: {
            left: '5%', top: '10px', right: '5%', bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                color: "rgba(255,255,255,0.8)",
                fontSize: 10,
                interval: 0,
                rotate: 45
            },
            axisLine: { show: false }
        },
        yAxis: {
            type: 'value',
            min: 5,
            max: 35,
            axisLabel: { color: "rgba(255,255,255,0.6)" }
        },
        series: [{
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
                barBorderRadius: 5,
                color: function (params) {
                    const temp = params.data;
                    const ratio = (temp - 10) / 20;
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: `rgba(255, ${Math.floor(255 * (1 - ratio))}, ${Math.floor(255 * (1 - ratio))}, 1)` },
                        { offset: 1, color: `rgba(200, 0, 0, 1)` }
                    ]);
                }
            },
            label: { show: true, position: 'top', color: '#fff' },
            animationDuration: 1000,
            animationEasing: 'elasticOut'
        }],
        dataZoom: [{
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 40,
            bottom: '5%'
        }]
    };
  
    let slideDirection = 1; // 滑动方向，1 表示正向，-1 表示反向
    let slideStep = 10; // 每次滑动的固定大小

    function updateData(selectedProvince) {
        let newData;
        let xAxisData;
        let barWidth;
        let dataZoomEnd;
        
        if (selectedProvince && provinceCityData[selectedProvince]) {
            newData = provinceCityData[selectedProvince].map(item => item.value);
            xAxisData = provinceCityData[selectedProvince].map(item => item.name);
            
            // 计算柱状图宽度，城市越多宽度越小
            barWidth = Math.min(80, Math.max(30, 60 - newData.length * 3)) + '%';
            
            // 根据城市数量调整数据缩放范围
            dataZoomEnd = Math.min(100, newData.length * 15);
        } else {
            newData = provinces.map(() => Math.floor(Math.random() * 21 + 10));
            xAxisData = provinces;
            barWidth = '60%';
            dataZoomEnd = 40;
        }

        let currentStart = myChart.getOption().dataZoom[0].start;
        let currentEnd = myChart.getOption().dataZoom[0].end;

        // 计算新的 start 和 end 值
        let newStart = currentStart + slideDirection * slideStep;
        let newEnd = currentEnd + slideDirection * slideStep;

        // 检查是否到达边界，若到达则改变滑动方向
        if (newEnd >= 100) {
            slideDirection = -1;
            newStart = 100 - (currentEnd - currentStart);
            newEnd = 100;
        } else if (newStart <= 0) {
            slideDirection = 1;
            newStart = 0;
            newEnd = currentEnd - currentStart;
        }
        
        myChart.setOption({
            xAxis: { data: xAxisData },
            series: [{ 
                data: newData,
                barWidth: barWidth
            }],
            dataZoom: [{
                start: newStart,
                end: newEnd
            }]
        });
    }
  
    myChart.setOption(baseOption);
    updateData();
  
    setInterval(updateData, 3000);
  
    window.addEventListener('resize', myChart.resize);
  
    window.updateBarChart = updateData;
  })();    

// 折线图模块：气温变化
(function () {
  const dateData = {
      dates: ["1月1日", "1月2日", "1月3日", "1月4日", "1月5日"],
      temperatures: [15, 16, 14, 13, 12, 14, 15]
  };

  const myChart = echarts.init(document.querySelector(".line .chart"));

  const option = {
      backgroundColor: 'transparent',
      color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
              { offset: 0, color: '#ff4d4d' },
              { offset: 0.5, color: '#ff7f7f' },
              { offset: 1, color: '#ff9999' }
          ]
      },
      tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: 'rgba(255,255,255,0.3)',
          textStyle: {
              color: '#fff',
              fontSize: 14
          },
          formatter: function (params) {
              return `<div style="font-weight:bold;margin-bottom:5px;">${params[0].name}</div>` +
                  `<span style="display:inline-block;margin-top:5px;border-radius:4px;padding:3px 8px;background:rgba(255,77,77,0.7);">气温: ${params[0].value}°C</span>`;
          }
      },
      legend: {
          data: ['气温变化'],
          textStyle: {
              color: '#ff4d4d',
              fontWeight: 'bold',
              fontSize: 14
          },
          right: '10%',
          top: '5%',
          itemStyle: {
              borderRadius: 4
          },
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: [8, 12]
      },
      grid: {
          top: "22%",
          left: '5%',
          right: '6%',
          bottom: '8%',
          containLabel: true,
          show: true,
          borderColor: 'rgba(255,255,255,0.1)'
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dateData.dates,
          axisTick: {
              show: false
          },
          axisLabel: {
              color: "#ff6666",
              fontSize: 12,
              fontWeight: 'bold'
          },
          axisLine: {
              lineStyle: {
                  color: 'rgba(255,255,255,0.2)'
              }
          }
      },
      yAxis: {
          type: 'value',
          axisTick: {
              show: false
          },
          axisLabel: {
              color: "#ff6666",
              fontSize: 12,
              fontWeight: 'bold'
          },
          axisLine: {
              lineStyle: {
                  color: 'rgba(255,255,255,0.2)'
              }
          },
          splitLine: {
              lineStyle: {
                  color: "rgba(255,255,255,0.1)",
                  width: 1,
                  type: 'dashed'
              }
          }
      },
      series: [{
          name: '气温变化',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 10,
          showSymbol: true,
          lineStyle: {
              width: 4,
              shadowColor: 'rgba(255, 77, 77, 0.5)',
              shadowBlur: 10,
              shadowOffsetY: 5
          },
          itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
          },
          emphasis: {
              itemStyle: {
                  color: '#ff1a1a',
                  borderColor: '#fff'
              }
          },
          data: dateData.temperatures,
          animationType: 'elastic',
          areaStyle: {
              color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                      { offset: 0, color: 'rgba(255, 77, 77, 0.3)' },
                      { offset: 1, color: 'rgba(255, 153, 153, 0.05)' }
                  ]
              }
          }
      }],
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
          return idx * 100;
      }
  };
  myChart.setOption(option);

  window.addEventListener('resize', function () {
      myChart.resize();
  });

  function updateLineChart(selectedProvince) {
      if (selectedProvince && provinceCityData[selectedProvince]) {
          const newTemperatures = provinceCityData[selectedProvince].map(item => item.value);
          myChart.setOption({
              series: [{
                  data: newTemperatures
              }]
          });
      } else {
          myChart.setOption({
              series: [{
                  data: dateData.temperatures
              }]
          });
      }
  }

  window.updateLineChart = updateLineChart;
})();

// 地图模块：全国气温分布 - 优化版本
(function () {
  var myChart = echarts.init(document.querySelector(".map .chart"));

  // 全国各省份气温数据
  var data = [
      { name: '北京', value: 20 },
      { name: '天津', value: 19 },
      { name: '河北', value: 18 },
      { name: '山西', value: 17 },
      { name: '内蒙古', value: 10 },
      { name: '辽宁', value: 12 },
      { name: '吉林', value: 8 },
      { name: '黑龙江', value: 5 },
      { name: '上海', value: 22 },
      { name: '江苏', value: 21 },
      { name: '浙江', value: 24 },
      { name: '安徽', value: 20 },
      { name: '福建', value: 26 },
      { name: '江西', value: 25 },
      { name: '山东', value: 19 },
      { name: '河南', value: 18 },
      { name: '湖北', value: 21 },
      { name: '湖南', value: 23 },
      { name: '广东', value: 27 },
      { name: '广西', value: 26 },
      { name: '海南', value: 29 },
      { name: '重庆', value: 24 },
      { name: '四川', value: 23 },
      { name: '贵州', value: 22 },
      { name: '云南', value: 20 },
      { name: '西藏', value: 15 },
      { name: '陕西', value: 17 },
      { name: '甘肃', value: 14 },
      { name: '青海', value: 12 },
      { name: '宁夏', value: 16 },
      { name: '新疆', value: 13 },
      { name: '香港', value: 28 },
      { name: '澳门', value: 28 },
      { name: '台湾', value: 27 }
  ];

  var option = {
      tooltip: {
          trigger: 'item',
          formatter: function (params) {
              return params.name + '<br/>气温: ' + params.value + '°C';
          }
      },
      visualMap: {
          min: 0,
          max: 30,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          // 协调的颜色渐变方案
          inRange: {
              color: ['#FFEEEE', '#FFCCCC', '#FF9999', '#FF6666', '#FF3333', '#FF0000', '#CC0000']
          },
          textStyle: {
              color: '#fff'
          }
      },
      geo: {
          map: 'china',
          roam: false,
          zoom: 1.2,
          label: {
              normal: {
                  show: true,
                  color: '#fff',
                  fontSize: 8
              },
              emphasis: {
                  color: '#fff'
              }
          },
          itemStyle: {
              normal: {
                  areaColor: '#1c2a43',
                  borderColor: '#FF6666',
                  borderWidth: 0.8,
                  opacity: 0.8
              },
              emphasis: {
                  areaColor: '#2a333d',
                  opacity: 1,
                  shadowColor: '#FF9999',
                  shadowBlur: 10
              }
          }
      },
      series: [
          {
              name: '气温',
              type: 'map',
              geoIndex: 0,
              data: data
          },
          {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: data.map(function (item) {
                  return {
                      name: item.name,
                      value: [item.name, item.value]
                  };
              }),
              symbolSize: function (val) {
                  return val[1] / 2;
              },
              showEffectOn: 'render',
              rippleEffect: {
                  brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                  normal: {
                      formatter: '{b}',
                      position: 'right',
                      show: true,
                      color: '#fff'
                  }
              },
              itemStyle: {
                  normal: {
                      color: '#FF3333',
                      shadowBlur: 10,
                      shadowColor: '#660000'
                  }
              },
              zlevel: 1
          }
      ]
  };

  myChart.setOption(option);

  // 添加定时更新动画效果
  setInterval(() => {
      const newData = myChart.getOption().series[0].data.map(item => {
          const newValue = Math.max(5, Math.min(50,
              item.value + (Math.random() - 0.3) * 10
          ));
          return {
              ...item,
              value: Math.round(newValue),
              itemStyle: {
                  color: item.itemStyle.color
              }
          };
      });

      myChart.setOption({
          series: [{
              data: newData,
              animationType: 'expansion',
              animationDuration: 800
          }]
      });
  }, 3000);

  // 让图表随屏幕自适应
  window.addEventListener('resize', function () {
      myChart.resize();
  });

  myChart.on('click', function (params) {
      const selectedProvince = params.name;
      window.updateBarChart(selectedProvince);
      window.updateLineChart(selectedProvince);
      // 调用其他图表的更新函数
      window.updatePieChart && window.updatePieChart(selectedProvince);
      window.updateRadarChart && window.updateRadarChart(selectedProvince);
      window.updateScatterChart && window.updateScatterChart(selectedProvince);
      window.updateGaugeChart && window.updateGaugeChart(selectedProvince);
  });
})();

// 饼图模块：气温区间分布
(function () {
  const chartDom = document.querySelector(".pie .chart");
  const myChart = echarts.init(chartDom, null, {
      renderer: 'canvas',
      devicePixelRatio: 2
  });

  const colorPalette = [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3BA0FF' },
          { offset: 1, color: '#36CBCB' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#4ECB73' },
          { offset: 1, color: '#A0DC7C' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#FBD437' },
          { offset: 1, color: '#FAAA35' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#F2637B' },
          { offset: 1, color: '#F5715D' }
      ])
  ];

  const data = [
      { value: 30, name: '0 - 10°C' },
      { value: 20, name: '10 - 20°C' },
      { value: 40, name: '20 - 30°C' },
      { value: 10, name: '30°C 以上' }
  ].map((item, index) => ({
      ...item,
      percent: Math.round((item.value / 100) * 100),
      itemStyle: { color: colorPalette[index] }
  }));

  const option = {
      backgroundColor: 'transparent',
      title: {
          text: '温度分布统计',
          left: 'center',
          top: 20,
          textStyle: {
              color: '#fff',  // 改为白色
              fontSize: 18,
              fontWeight: 'bold'
          }
      },
      tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: 'rgba(255,255,255,0.2)',
          textStyle: {
              color: '#fff',
              fontSize: 14
          },
          formatter: params => {
              return `<div style="font-weight:bold">${params.name}</div>
                      <div style="margin-top:5px">占比: ${params.percent}%</div>
                      <div>天数: ${params.value}天</div>`;
          }
      },
      legend: {
          orient: 'vertical',
          right: 20,
          top: 'center',
          textStyle: {
              color: '#fff',  // 改为白色
              fontSize: 12
          },
          formatter: name => {
              const item = data.find(d => d.name === name);
              return `${name} (${item.percent}%)`;
          }
      },
      series: [{
          name: '温度分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: true,
          itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
          },
          label: {
              show: true,
              formatter: '{b}: {d}%',
              color: '#fff',  // 改为白色
              fontSize: 12,
              fontWeight: 'bold',
              position: 'outside',
              alignTo: 'edge',
              margin: 20
          },
          labelLayout: {
              hideOverlap: true,
              moveOverlap: 'shiftY'
          },
          emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                  show: true,
                  fontSize: 14,
                  fontWeight: 'bold'
              }
          },
          labelLine: {
              show: true,
              length: 15,
              length2: 30,
              smooth: true,
              lineStyle: {
                  color: 'rgba(255,255,255,0.5)'  // 标签引导线改为半透明白色
              }
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
              return Math.random() * 200;
          },
          data: data
      }]
  };

  myChart.setOption(option);

  let currentAngle = 0;
  setInterval(() => {
      currentAngle += 0.5;
      myChart.setOption({
          series: [{
              startAngle: currentAngle
          }]
      });
  }, 50);

  window.addEventListener('resize', myChart.resize);

  function updatePieChart(selectedProvince) {
      // 这里需要根据省份数据更新饼图逻辑
      // 示例中简单重置为初始数据
      myChart.setOption({
          series: [{
              data: data
          }]
      });
  }

  window.updatePieChart = updatePieChart;
})();

// 新增雷达图模块：各地区气温雷达图
(function () {
  const myChart = echarts.init(document.querySelector(".radar .chart"));

  const cityData = [
      { name: '北京', value: 20, region: '华北' },
      { name: '上海', value: 22, region: '华东' },
      { name: '广州', value: 25, region: '华南' },
      { name: '深圳', value: 26, region: '华南' },
      { name: '成都', value: 23, region: '西南' },
      { name: '武汉', value: 21, region: '华中' },
      { name: '杭州', value: 24, region: '华东' },
      { name: '哈尔滨', value: 15, region: '东北' },
      { name: '乌鲁木齐', value: 18, region: '西北' },
      { name: '昆明', value: 22, region: '西南' },
      { name: '拉萨', value: 16, region: '西南' },
      { name: '西安', value: 24, region: '西北' }
  ];

  const regionColors = {
      '华北': '#FF6B6B', '华东': '#FF8E8E', '华南': '#FFAAAA',
      '华中': '#FFC3C3', '西南': '#FFD8D8', '西北': '#FFE5E5',
      '东北': '#FFF0F0'
  };

  const option = {
      backgroundColor: 'transparent',
      title: {
          text: '全国主要城市气温分布(℃)',
          left: 'center',
          textStyle: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
      },
      tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: 'rgba(255,255,255,0.2)',
          textStyle: { color: '#fff' },
          formatter: params => {
              const data = cityData.find(item => item.name === params.name);
              return `${params.name}<br/>气温: ${params.value}℃<br/>区域: ${data.region}`;
          }
      },
      legend: {
          data: Object.keys(regionColors).map(region => ({
              name: region,
              itemStyle: { color: regionColors[region] }
          })),
          right: '5%',
          top: '10%',
          textStyle: { color: '#fff' }
      },
      radar: {
          center: ['50%', '52%'],
          radius: '65%',
          startAngle: 60,
          splitNumber: 4,
          axisName: {
              color: '#fff',
              fontSize: 10,
              padding: [0, 5],
              formatter: name => {
                  const data = cityData.find(item => item.name === name);
                  return `${data.region}\n${name}`;
              }
          },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
          axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
          indicator: cityData.map(item => ({ name: item.name, max: 30 }))
      },
      series: [{
          type: 'radar',
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
              width: 3,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#FF0000' },
                  { offset: 1, color: '#FF4500' }
              ])
          },
          areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: 'rgba(255, 0, 0, 0.5)' },
                  { offset: 1, color: 'rgba(255, 69, 0, 0.3)' }
              ])
          },
          data: [{
              value: cityData.map(item => item.value),
              name: '气温',
              label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}℃',
                  color: '#fff',
                  fontSize: 10,
                  textShadowBlur: 5,
                  textShadowColor: '#000'
              }
          }],
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDuration: 2000
      }]
  };

  myChart.setOption(option);

  // 区域筛选交互
  myChart.on('legendselectchanged', function (params) {
      const selectedRegion = params.name;
      const filteredData = selectedRegion ?
          cityData.filter(item => item.region === selectedRegion) : cityData;

      myChart.setOption({
          radar: { indicator: filteredData.map(item => ({ name: item.name, max: 30 })) },
          series: [{ data: [{ value: filteredData.map(item => item.value) }] }]
      });
  });

  // 自动旋转动画
  let angle = 0;
  const rotateInterval = setInterval(() => {
      angle = (angle + 0.5) % 360;
      myChart.setOption({ radar: { startAngle: angle } });
  }, 50);

  window.addEventListener('resize', function () {
      myChart.resize();
  });

  function updateRadarChart(selectedProvince) {
      // 这里需要根据省份数据更新雷达图逻辑
      // 示例中简单重置为初始数据
      myChart.setOption(option);
  }

  window.updateRadarChart = updateRadarChart;
})();

// 新增散点图模块：气温与湿度散点图
(function () {
  const myChart = echarts.init(document.querySelector(".scatter .chart"));
  const cityData = [
      // 华北地区
      { name: '北京', value: [19, 61], region: '华北' },
      { name: '天津', value: [20, 62], region: '华北' },
      { name: '石家庄', value: [21, 60], region: '华北' },
      { name: '太原', value: [18, 59], region: '华北' },

      // 华东地区
      { name: '上海', value: [23, 66], region: '华东' },
      { name: '南京', value: [22, 65], region: '华东' },
      { name: '杭州', value: [24, 67], region: '华东' },
      { name: '合肥', value: [21, 64], region: '华东' },

      // 华南地区
      { name: '广州', value: [26, 69], region: '华南' },
      { name: '深圳', value: [25, 68], region: '华南' },
      { name: '南宁', value: [24, 70], region: '华南' },
      { name: '海口', value: [27, 71], region: '华南' },

      // 华中地区
      { name: '武汉', value: [22, 64], region: '华中' },
      { name: '长沙', value: [23, 65], region: '华中' },
      { name: '郑州', value: [19, 61], region: '华中' },
      { name: '南昌', value: [24, 66], region: '华中' },

      // 西南地区
      { name: '成都', value: [22, 63], region: '西南' },
      { name: '重庆', value: [23, 64], region: '西南' },
      { name: '昆明', value: [19, 62], region: '西南' },
      { name: '贵阳', value: [18, 61], region: '西南' },

      // 西北地区
      { name: '西安', value: [23, 65], region: '西北' },
      { name: '兰州', value: [18, 59], region: '西北' },
      { name: '银川', value: [17, 58], region: '西北' },
      { name: '乌鲁木齐', value: [16, 57], region: '西北' },

      // 东北地区
      { name: '哈尔滨', value: [17, 59], region: '东北' },
      { name: '长春', value: [18, 60], region: '东北' },
      { name: '沈阳', value: [19, 61], region: '东北' },
      { name: '大连', value: [20, 62], region: '东北' }
  ];

  const regionColors = {
      '华北': '#5470C6', '华东': '#91CC75', '华南': '#FAC858',
      '华中': '#EE6666', '西南': '#73C0DE', '西北': '#3BA272',
      '东北': '#FC8452'
  };

  const option = {
      title: {
          text: '全国主要城市气温湿度分布',
          left: 'center',
          textStyle: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#fff'
          }
      },
      tooltip: {
          trigger: 'item',
          formatter: params => `
      <div style="font-weight:bold;color:#fff">${params.name}</div>
      <div>气温: <span style="color:#4c9bfd">${params.value[0]}°C</span></div>
      <div>湿度: <span style="color:#4c9bfd">${params.value[1]}%</span></div>
      <div>区域: <span style="color:${regionColors[params.data.region]}">${params.data.region}</span></div>
    `,
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#333',
          textStyle: {
              color: '#fff'
          }
      },
      legend: {
          data: Object.keys(regionColors).map(region => ({
              name: region,
              itemStyle: { color: regionColors[region] }
          })),
          right: 20,
          top: 50,
          textStyle: {
              fontSize: 12,
              color: '#fff'
          }
      },
      xAxis: {
          type: 'value',
          name: '气温(°C)',
          nameLocation: 'middle',
          nameGap: 25,
          min: 15,
          max: 30,
          axisLine: {
              lineStyle: {
                  color: '#fff'
              }
          },
          axisLabel: {
              color: '#fff'
          },
          splitLine: {
              show: false
          }
      },
      yAxis: {
          type: 'value',
          name: '湿度(%)',
          nameLocation: 'middle',
          nameGap: 30,
          min: 55,
          max: 75,
          axisLine: {
              lineStyle: {
                  color: '#fff'
              }
          },
          axisLabel: {
              color: '#fff'
          },
          splitLine: {
              show: false
          }
      },
      series: [{
          type: 'scatter',
          symbolSize: 20,
          data: cityData.map(item => ({
              ...item,
              itemStyle: {
                  color: regionColors[item.region],
                  shadowBlur: 5,
                  shadowColor: 'rgba(0,0,0,0.2)',
                  opacity: 0.6
              }
          })),
          label: {
              show: true,
              formatter: '{b}',
              fontSize: 12,
              color: '#fff',
              position: 'right',
              offset: [5, 0],
              textBorderColor: '#000',
              textBorderWidth: 2
          },
          emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0,0,0,0.3)',
                  opacity: 0.9
              },
              label: {
                  show: true,
                  fontWeight: 'bold'
              }
          }
      }]
  };
  myChart.setOption(option);
  window.addEventListener('resize', myChart.resize);

  function updateScatterChart(selectedProvince) {
      // 这里需要根据省份数据更新散点图逻辑
      // 示例中简单重置为初始数据
      myChart.setOption(option);
  }

  window.updateScatterChart = updateScatterChart;
})();

// 新增仪表盘模块：气温达标率仪表盘
(function () {
  const myChart = echarts.init(document.querySelector(".gauge .chart"));

  const option = {
      backgroundColor: 'transparent',
      tooltip: {
          show: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          textStyle: {
              color: '#fff',
              fontSize: 14
          },
          formatter: '{a}<br/>{b}: {c}%'
      },
      series: [{
          name: '全国气温达标率',
          type: 'gauge',
          radius: '95%',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 5,
          pointer: {
              show: true,
              length: '75%',
              width: 6
          },
          axisLine: {
              lineStyle: {
                  width: 15,
                  color: [
                      [0.3, '#67e0e3'],
                      [0.7, '#37a2da'],
                      [1, '#fd666d']
                  ]
              }
          },
          axisTick: {
              length: 10,
              lineStyle: {
                  color: 'rgba(255, 255, 255, 0.8)',
                  width: 1
              }
          },
          splitLine: {
              length: 15,
              lineStyle: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  width: 2
              }
          },
          axisLabel: {
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 12,
              distance: -20,
              formatter: function (v) {
                  return v + '%';
              }
          },
          detail: {
              formatter: '{value}%',
              fontSize: 28,
              fontWeight: 'bolder',
              color: '#ffffff',
              offsetCenter: [0, '40%']
          },
          data: [{
              value: 85,
              name: '达标率',
              title: {
                  color: '#eee',
                  fontSize: 16,
                  offsetCenter: [0, '70%']
              }
          }],
          itemStyle: {
              color: '#FFD700',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
      }],
      animationDuration: 1500
  };

  myChart.setOption(option);

  // 动态数据更新
  setInterval(() => {
      const newValue = (Math.random() * 15 + 80).toFixed(1);
      myChart.setOption({
          series: [{
              data: [{
                  value: newValue,
                  name: '达标率'
              }]
          }]
      });
  }, 2500);

  window.addEventListener('resize', myChart.resize);

  function updateGaugeChart(selectedProvince) {
      // 这里需要根据省份数据更新仪表盘逻辑
      // 示例中简单重置为初始数据
      myChart.setOption(option);
  }

  window.updateGaugeChart = updateGaugeChart;
})();