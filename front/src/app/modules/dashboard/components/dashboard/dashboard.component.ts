
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Subscription } from 'rxjs';
import { AppConfig, LayoutService } from 'src/app/shared/template/service/app.layout.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  cities: SelectItem[] = [];

    products: any[] = [];

    ordersChart: any;

    ordersOptions: any;

    selectedCity: any;

    timelineEvents: any[] = [];

    overviewChartData1: any;

    overviewChartData2: any;

    overviewChartData3: any;

    overviewChartData4: any;

    overviewChartOptions1: any;

    overviewChartOptions2: any;

    overviewChartOptions3: any;

    overviewChartOptions4: any;

    chatMessages: any[] = [];

    chatEmojis: any[] = [];

    config!: AppConfig;

    subscription!: Subscription;

    @ViewChild('chatcontainer') chatContainerViewChild!: ElementRef;

    constructor( public layoutService: LayoutService) {

        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.config = config;
            this.orderGraphChartInit()
        });
    }

    ngOnInit() {
        // this.productService.getProducts().then(data => this.products = data);

        this.cities = [];
        this.cities.push({ label: 'Select City', value: null });
        this.cities.push({ label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } });
        this.cities.push({ label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } });
        this.cities.push({ label: 'London', value: { id: 3, name: 'London', code: 'LDN' } });
        this.cities.push({ label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } });
        this.cities.push({ label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } });

        this.chatMessages = [
            { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Hey M. hope you are well.', 'Our idea is accepted by the board. Now it’s time to execute it'] },
            { messages: ['We did it! 🤠'] },
            { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['That\'s really good!'] },
            { messages: ['But it’s important to ship MVP ASAP'] },
            { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['I’ll be looking at the process then, just to be sure 🤓'] },
            { messages: ['That’s awesome. Thanks!'] }
        ];

        this.chatEmojis = [
            '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉', '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '😛',
            '🤑', '😎', '🤓', '🧐', '🤠', '🥳', '🤗', '🤡', '😏', '😶', '😐', '😑', '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '🤥', '😳', '😞', '😟', '😠', '😡', '🤬', '😔',
            '😟', '😠', '😡', '🤬', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '🤤'
        ];

        this.orderGraphChartInit()

        this.overviewChartData1 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
            datasets: [
                {
                    data: [50, 64, 32, 24, 18, 27, 20, 36, 30],
                    borderColor: [
                        '#4DD0E1',
                    ],
                    backgroundColor: [
                        'rgba(77, 208, 225, 0.8)',
                    ],
                    borderWidth: 2,
                    fill: true,
                    tension: .4
                }
            ]
        };

        this.overviewChartData2 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
            datasets: [
                {
                    data: [11, 30, 52, 35, 39, 20, 14, 18, 29],
                    borderColor: [
                        '#4DD0E1',
                    ],
                    backgroundColor: [
                        'rgba(77, 208, 225, 0.8)',
                    ],
                    borderWidth: 2,
                    fill: true,
                    tension: .4
                }
            ]
        };

        this.overviewChartData3 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
            datasets: [
                {
                    data: [20, 29, 39, 36, 45, 24, 28, 20, 15],
                    borderColor: [
                        '#4DD0E1',
                    ],
                    backgroundColor: [
                        'rgba(77, 208, 225, 0.8)',
                    ],
                    borderWidth: 2,
                    fill: true,
                    tension: .4
                }
            ]
        };

        this.overviewChartData4 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
            datasets: [
                {
                    data: [30, 39, 50, 21, 33, 18, 10, 24, 20],
                    borderColor: [
                        '#4DD0E1',
                    ],
                    backgroundColor: [
                        'rgba(77, 208, 225, 0.8)',
                    ],
                    borderWidth: 2,
                    fill: true,
                    tension: .4
                }
            ]
        };

        this.overviewChartOptions1 = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    display: false
                }
            },
            tooltips: {
                enabled: false
            },
            elements: {
                point: {
                    radius: 0
                }
            },
        };

        this.overviewChartOptions2 = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    display: false
                }
            },
            tooltips: {
                enabled: false
            },
            elements: {
                point: {
                    radius: 0
                }
            },
        };

        this.overviewChartOptions3 = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    display: false
                }
            },
            tooltips: {
                enabled: false
            },
            elements: {
                point: {
                    radius: 0
                }
            },
        };

        this.overviewChartOptions4 = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    display: false
                }
            },
            tooltips: {
                enabled: false
            },
            elements: {
                point: {
                    radius: 0
                }
            },
        };

        this.setOverviewColors();

        // this.appMain['refreshChart'] = () => {
        //     this.ordersOptions = this.getOrdersOptions();
        //     this.setOverviewColors();
        // };

        this.timelineEvents = [
            { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#E91E63', description: 'Richard Jones (C8012) has ordered a blue t-shirt for $79.' },
            { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#FB8C00', description: 'Order #99207 has processed succesfully.' },
            { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-compass', color: '#673AB7', description: 'Order #99207 has shipped with shipping code 2222302090.' },
            { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check-square', color: '#0097A7', description: 'Richard Jones (C8012) has recieved his blue t-shirt.' }
        ];
    }

    onEmojiClick(chatInput: any, emoji: string) {
        if (chatInput) {
            chatInput.value += emoji;
            chatInput.focus();
        }
    }

    onChatKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const message = (<HTMLInputElement>event.currentTarget).value;
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];

            if (lastMessage.from) {
                this.chatMessages.push({ messages: [message] });
            }
            else {
                lastMessage.messages.push(message);
            }

            if (message.match(/primeng|primereact|primefaces|primevue/i)) {
                this.chatMessages.push({ from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Always bet on Prime!'] });
            }

            (<HTMLInputElement>event.currentTarget).value = '';

            const el = this.chatContainerViewChild.nativeElement;
            setTimeout(() => {
                el.scroll({
                    top: el.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1);
        }
    }

    setOverviewColors() {
        const { pinkBorderColor, pinkBgColor, tealBorderColor, tealBgColor } = this.getOverviewColors();

        this.overviewChartData1.datasets[0].borderColor[0] = tealBorderColor;
        this.overviewChartData1.datasets[0].backgroundColor[0] = tealBgColor;

        this.overviewChartData2.datasets[0].borderColor[0] = tealBorderColor;
        this.overviewChartData2.datasets[0].backgroundColor[0] = tealBgColor;

        this.overviewChartData3.datasets[0].borderColor[0] = pinkBorderColor;
        this.overviewChartData3.datasets[0].backgroundColor[0] = pinkBgColor;

        this.overviewChartData4.datasets[0].borderColor[0] = tealBorderColor;
        this.overviewChartData4.datasets[0].backgroundColor[0] = tealBgColor;
    }

    getOverviewColors() {
        const isLight = true;
        return {
            pinkBorderColor: isLight ? '#E91E63' : '#EC407A',
            pinkBgColor: isLight ? '#F48FB1' : '#F8BBD0',
            tealBorderColor: isLight ? '#009688' : '#26A69A',
            tealBgColor: isLight ? '#80CBC4' : '#B2DFDB'
        };
    }

    getOrdersOptions() {
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
        const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--surface-border') || 'rgba(160, 167, 181, .3)';
        const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
        return {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        fontFamily,
                        color: textColor,
                    }
                }
            },
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        fontFamily,
                        color: textColor
                    },
                    grid: {
                        color: gridLinesColor
                    }
                },
                x: {
                    ticks: {
                        fontFamily,
                        color: textColor
                    },
                    grid: {
                        color: gridLinesColor
                    }
                }
            }
        };
    }

    orderGraphChartInit() {
        this.ordersChart = {
            labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre' , 'Novembre' , 'Decemebre'],
            datasets: [{
                label: 'CA',
                data: [2, 1, 0, 3, 2, 1, 4, 5, 2 ,0 ,1 ,3],
                borderColor: [
                    '#4DD0E1',
                ],
                backgroundColor: [
                    'rgba(77, 208, 225, 0.8)',
                ],
                borderWidth: 2,
                fill: true,
                tension: .4
            }, {
                label: 'AG',
                data: [4, 1, 2, 6, 5, 3, 0, 2, 4 , 3 , 1,5],
                borderColor: [
                    '#3F51B5',
                ],
                backgroundColor: [
                    'rgba(63, 81, 181, 0.8)',
                ],
                borderWidth: 2,
                fill: true,
                tension: .4
            }]
        };

        this.ordersOptions = this.getOrdersOptions();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
