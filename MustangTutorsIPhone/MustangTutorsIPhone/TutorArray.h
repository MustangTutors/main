//
//  TutorArray.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/21/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TutorArray : NSObject
@property(strong,nonatomic)NSMutableArray * tutors;
@property(nonatomic,getter = getNumTutors)NSInteger numTutors;
-(instancetype)initWithTutorArray:(NSMutableArray *)tutorArray;
@end
