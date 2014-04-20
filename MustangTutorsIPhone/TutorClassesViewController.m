//
//  TutorClassesViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/15/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "TutorClassesViewController.h"
#import "TabBarViewController.h"
#import "ClassesTableViewCell.h"
@interface TutorClassesViewController ()
@property (weak, nonatomic) IBOutlet UILabel *nameCoursesLabel;

@end

@implementation TutorClassesViewController

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
    
    NSLog(@"%d",[[self.tutor getCourses] count]);
    return [[self.tutor getCourses] count];    //number of cells will be number of objects in classes
}
- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section {
    // This will create a "invisible" footer
    return 0.01f;
}



- (UITableViewCell *)tableView:(UITableView *)tableView
         cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *MyIdentifier = @"classCell";
    
    ClassesTableViewCell *cell = (ClassesTableViewCell *)[tableView dequeueReusableCellWithIdentifier:MyIdentifier];
    
    if (cell == nil)
    {
        //cell = [[[ScheduleTimeTableViewCell alloc] init] reuseIdentifier:MyIdentifier];
    }
    
    NSString * courseName =[[[self.tutor getCourses]objectAtIndex:indexPath.row]objectForKey:@"course_name"];
    NSString * subject =[[[self.tutor getCourses]objectAtIndex:indexPath.row]objectForKey:@"subject"];
    NSInteger courseNumber = [[[[self.tutor getCourses]objectAtIndex:indexPath.row]objectForKey:@"course_number"]integerValue];
    [cell.classLabel setText:[NSString stringWithFormat:@"%@ %d: %@",subject,courseNumber,courseName]];
    
    return cell;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    TabBarViewController * tabBar = (TabBarViewController *)self.tabBarController;
    self.tutor = tabBar.tutor;

    self.tutorClassesTableView.tableFooterView = [[UIView alloc]initWithFrame:CGRectZero];
    
    [self.nameCoursesLabel setText:[NSString stringWithFormat:@"%@'s Courses",[self.tutor getFullName]]];
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
