//
//  TutorCommentsViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/14/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "TutorCommentsViewController.h"
#import "TabBarViewController.h"

@interface TutorCommentsViewController ()
@property (weak, nonatomic) IBOutlet UILabel *Name_CommentsLabel;
@property (weak, nonatomic) IBOutlet UIScrollView *commentsScrollView;

@end

@implementation TutorCommentsViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    TabBarViewController * tabBar = (TabBarViewController *)self.tabBarController;
    self.tutor = tabBar.tutor;

    [self.Name_CommentsLabel setText:[NSString stringWithFormat:@"%@'s Comments",[self.tutor getFullName]]];
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
