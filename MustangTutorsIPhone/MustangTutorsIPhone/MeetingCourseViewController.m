//
//  MeetingCourseViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "MeetingCourseViewController.h"
#import "MeetingDateViewController.h"
@interface MeetingCourseViewController ()
@property(nonatomic,strong)NSArray * pickerCourses;
@end

@implementation MeetingCourseViewController
- (IBAction)goToDateSegue:(UIBarButtonItem *)sender {
    //[self.meetingDocument setCourseName:[self.coursePickerView self]];
}
-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Make sure your segue name in storyboard is the same as this line
    if ([[segue identifier] isEqualToString:@"segueToMeetingDate"])
    {
        // Get reference to the destination view controller
        MeetingDateViewController * vc = (MeetingDateViewController *)[segue destinationViewController];
        
        // Pass any objects to the view controller here, like...
        [vc setMeetingDocument:self.meetingDocument];
        vc.tutor = self.tutor;
        
    }
}
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
-(NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView
{
    //One column
    return 1;
}

-(NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component
{
    //set number of rows
    return [[self.tutor getCourses]count];
}

-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component
{
    //set item per row
    NSString * courseName = [[[self.tutor getCourses] objectAtIndex:row]objectForKey:@"course_name"];
    NSString * courseNumber = [[[self.tutor getCourses] objectAtIndex:row]objectForKey:@"course_number"];
    NSString * subject = [[[self.tutor getCourses] objectAtIndex:row]objectForKey:@"subject"];
    NSString * pickerString = [NSString stringWithFormat:@"%@ %@ - %@",subject, courseNumber,courseName];
    return pickerString;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
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
