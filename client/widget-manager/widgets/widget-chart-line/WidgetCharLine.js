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

Template.WidgetChartLine.helpers({
	loading() {
		Template.instance().state.get('loading') && 'loading';
	}
});

Template.WidgetChartLine.onCreated(function () {
	this.state = new ReactiveDict({});
});

const parseData = data => data.v.map((value, index) => [new Date(data.c[index]).getTime(), parseFloat(value)]).sort(([dataA], [dataB]) => dataA - dataB)

Template.WidgetChartLine.onRendered(async function () {

	// Tracker.autorun(function() {
	const widget = this.data.data
	// Tracker.autorun(function()
	const instance = Template.instance()

	this.state.set('loading', true);

	const { device, attribute } = widget.series[0];
	const serie = parseData(await call('data.get', {
		id: device,
		key: attribute
	}));

	this.state.set('loading', false);

	Highcharts.setOptions({
		global: {
			timezoneOffset: new Date().getTimezoneOffset()
		}
	})

	this.subscribe('DataFromDashboard', {
		keys: device,
		variables: attribute
	})

	const map = Highcharts.stockChart(this.find('.graph'), {
		chart: {
			animation: false,
			zoomType: 'x',
			events: {
				load: () => {

				}
			}
		},
		rangeSelector,
		title: {
			text: widget.title
		},
		subtitle: {
			text: widget.subtitle
		},
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			title: {
				text: widget.yAxis
			}
		},
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
			series: {
				turboThreshold: 1000,
				animation: {
					duration: 0,
				}
			},

			line: {
				dataLabels: {
					// enabled: true
				}
			}
		},
		series: [{
			data: serie,
			...widget.series
		}],
		responsive: {
			rules: [{
				condition: {
					maxWidth: '100%'
				},
				chartOptions: {
					legend: {
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					}
				}
			}]
		}
	})

	const cursor = Data.find({
		owner: device,
		name: attribute,
		createAt: {$gt : new Date() }
	}, {
		sort: {
			"createAt": 1
		}
	});

	this.observe = cursor.observe({
		added: (data) => {
			map.series[0].addPoint([new Date(data.createAt).getTime(), parseFloat(data.value)]);
		}
	})

});
Template.WidgetChartLine.onDestroyed(function () {
	this.observe.stop();
});
