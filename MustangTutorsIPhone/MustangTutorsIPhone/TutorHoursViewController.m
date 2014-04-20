//
//  TutorHoursViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/14/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "TutorHoursViewController.h"
#import "TabBarViewController.h"
#import "ScheduleTimeTableViewCell.h"
@interface TutorHoursViewController ()
@property (weak, nonatomic) IBOutlet UILabel *NameScheduleLabel;
@property (weak, nonatomic) IBOutlet UITableView *scheduleTableView;

@end

@implementation TutorHoursViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;    //count of section
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    
    return [[self.tutor getHours] count];    //number of cells will be number of objects in hours
}
- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section {
    // This will create a "invisible" footer
    return 0.01f;
}



- (UITableViewCell *)tableView:(UITableView *)tableView
         cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *MyIdentifier = @"scheduleCell";
    
    ScheduleTimeTableViewCell *cell = (ScheduleTimeTableViewCell *)[tableView dequeueReusableCellWithIdentifier:MyIdentifier];
    
    if (cell == nil)
    {
        //cell = [[[ScheduleTimeTableViewCell alloc] init] reuseIdentifier:MyIdentifier];
    }
    NSInteger dayOfWeek = [[[[self.tutor getHours]objectAtIndex:indexPath.row]objectForKey:@"day"]integerValue];
    NSString * day = [[NSString alloc]init];
    if(dayOfWeek == 1){
        day = @"Sunday";
    }else if(dayOfWeek ==2){
        day = @"Monday";
    }else if(dayOfWeek ==3){
        day = @"Tuesday";
    }else if(dayOfWeek ==4){
        day = @"Wednesday";
    }else if(dayOfWeek ==5){
        day = @"Thursday";
    }else if(dayOfWeek ==6){
        day = @"Friday";
    }else{
        day = @"Saturday";
    }
    [cell.ScheduleTimeLabel setText:[NSString stringWithFormat:@"%@ %@ - %@",day,[[[self.tutor getHours]objectAtIndex:indexPath.row]objectForKey:@"start_time"],[[[self.tutor getHours]objectAtIndex:indexPath.row]objectForKey:@"end_time"]]];
    return cell;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    TabBarViewController * tabBar = (TabBarViewController *)self.tabBarController;
    self.tutor = tabBar.tutor;
    
    [self.NameScheduleLabel setText:[NSString stringWithFormat:@"%@'s Schedule",[self.tutor getFullName]]];
    self.scheduleTableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];


}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
