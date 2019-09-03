import Highcharts from 'highcharts/highstock'
require('highcharts/modules/exporting')(Highcharts)

import Data from '../../../../collections/Data'

const call = (...args) => new Promise((resolve, reject) => {

	Meteor.call(...args, (err, result) => {
		if (err) {
			return reject(err);
		}
		resolve(result)
	})

})


const rangeSelector = {

	buttons: [{
		type: 'day',
		count: 1,
		text: '1d'
	}, {
		type: 'day',
		count: 3,
		text: '3d'
	}, {
		type: 'week',
		count: 1,
		text: '1w'
	}, {
		type: 'month',
		count: 1,
		text: '1m'
	}, {
		type: 'all',
		text: 'All'
	}],
	selected: 0
};

Template.WidgetChartLineMultipleAxis.helpers({
	widgets() {
		return Widget.find({});
	}
});

Template.WidgetChartLineMultipleAxis.events({});
Template.WidgetChartLineMultipleAxis.onCreated(function () {
	this.state = new ReactiveDict({});
});

const parseData = data => data.v.map((value, index) => [new Date(data.c[index]).getTime(), parseFloat(value)]).sort(([dataA], [dataB]) => dataA - dataB)

Template.WidgetChartLineMultipleAxis.onRendered(async function () {

	this.state.set('loading', true);

	const widget = this.data.data;

	this.subscribe('DataFromDashboard', {
		keys: widget.device,
		variables: widget.attribute
	})


	const series = await Promise.all(widget.series.filter(e => Object.keys(e).length).map(async ({
		device,
		attribute,
		...options
	}, index) => {

			setTimeout(() => {

								const cursor = Data.find({
									owner: device,
									name: attribute
								});

								this.observe = cursor.observe({
									added: (data) => {
										map.series[index].addPoint([new Date(data.createAt).getTime(), parseFloat(data.value)]);
									}
								})

			}, 200)

		return {
			...options,
			yAxis: index,
			name: options.yAxis,
			data: parseData(await call('data.get', {
				id: device,
				key: attribute
			}))
		}




		// return {
		// 	...options,
		// 	yAxis: index,
		// 	cursor,
		// 	data: cursor.fetch().map((data) => [new Date(data.createAt).getTime(), parseFloat(data.value)])
		// }
	}))


	this.state.set('loading', false);

	// let that = this

	//   // Tracker.autorun(function() {
	//   let series = widget.series.map(({
	//     device,
	//     attribute,
	//     ...options
	//   }, index) => {
	//     let cursor = Data.find({
	//       owner: device,
	//       name: attribute
	//     })
	//     return { ...options,
	//       yAxis: index,
	//       cursor,
	//       data: cursor.fetch().map((data) => [new Date(data.createAt).getTime(), parseFloat(data.value)])
	//     }
	//   })

	//   if (series.length == 0) {
	//     return
	//   }
	let map = Highcharts.stockChart(this.find('.graph'), {
		rangeSelector,
		chart: {
			zoomType: 'xy'
		},
		title: {
			text: widget.title
		},
		subtitle: {
			text: widget.subtitle
		},
		xAxis: {
			type: 'datetime'
		},
		yAxis: series.map(serie => ({
			style: {
				color: serie.color,
			},
			title: {
				text: serie.name
			}
		})),
		legend: {
			layout: 'vertical',
			align: 'left',
			x: 80,
			verticalAlign: 'top',
			y: 55,
			floating: true,
			backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
		},
		credits: {
			enabled: false
		},
		tooltip: {
			shared: true
		},
		plotOptions: {
			line: {
				dataLabels: {
					enabled: true
				}
			}
		},
		series: series.map(({
			cursor,
			...options
		}) => {
			return {
				...options,
				dataGrouping: {
					enabled: true
				}
			}
		})
	});
});

Template.WidgetChartLineMultipleAxis.onDestroyed(function () {
	const instance = Template.instance()
	if (instance.cursor) instance.cursor.forEach(c => c.stop())

});
